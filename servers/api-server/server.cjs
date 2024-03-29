require('dotenv').config({path: '../../.env.development'});

const {checkAccess, userLogIn, getUserPages, getListOfSharedUsersForPage} = require('./controllers/userController.cjs')
const {createPage, getPage, savePageContent, getPageContent, deletePage, sharePage, saveTitle, getAllSharedPagesForUser} = require('./controllers/pageController.cjs')

const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Server is running correctly' });
});

app.post('/userlogin', userLogIn);

app.get('/checkaccess', checkAccess);

app.get('/getuserssharingpage', getListOfSharedUsersForPage);

app.get('/getsharedpages', getAllSharedPagesForUser);

app.get('/getuserpages', getUserPages);

app.post('/createpage', createPage);

app.get('/getpage', getPage);

app.patch('/savepagecontent', savePageContent);

app.get('/getpagecontent', getPageContent);

app.get('/deletepage', deletePage);

app.get('/sharepage', sharePage);

app.post('/savetitle', saveTitle);

const roomState = {}

io.on('connection', (socket) => {
    console.log('someone connected');

    const roomID = socket.handshake.query.roomId;
    const username = socket.handshake.query.username

    socket.join(roomID)

    if (!roomState[roomID]) {
        roomState[roomID] = {
            users: [],
        }
    }

    roomState[roomID].users.push(username)
    io.to(roomID).emit('userJoin', roomState[roomID].users)
    console.log(roomState[roomID])

    socket.on('disconnect', () => {

        const index = roomState[roomID].users.indexOf(username);
        console.log(index)
        if (index !== -1) {
            roomState[roomID].users.splice(index, 1);
        }

        console.log(username, 'disconnected', roomState[roomID].users);
        io.to(roomID).emit('userDisconnect', (roomState[roomID].users))
    })

    socket.on('connected', (data) => {
        console.log(data);
    })

    socket.on('titleChange', (data) => {
        io.to(roomID).emit("newTitle", (data))
    })

    socket.on('processingCode', () => {
        io.to(roomID).emit('processingCode');
    })

    socket.on('finishedProcessingCode', (output) => {
        io.to(roomID).emit('finishedProcessingCode', output);
    })
})


server.listen(3636);
