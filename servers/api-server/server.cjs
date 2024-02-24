require('dotenv').config({path: '../../.env'});

const express = require('express');
const cors = require('cors');
const app = express();
const { nanoid } = require('nanoid');
const {Pool} = require('pg');

const http = require('http');
const {Server} = require("socket.io");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: process.env.SQL_DATABSE,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT
})

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.post('/userlogin', async (req, res) => {

    let username = req.body.data.username;
    let userID = req.body.data.id;

    try {
        const query = await pool.query('INSERT INTO users(username, "userID") VALUES($1, $2)', [username, userID])
        console.log(username, userID, 'added to db');
    } catch (err) {
        console.log('error at userlogin route')
        console.log(err.message);
    }

})


app.post('/createpage', async(req, res) => {

    let userId = req.body.userID;
    const username = req.body.username
    let pageTitle = "Untitled";
    let createdTime = new Date();
    let pageID = nanoid(10);
    let content = ''

    try {
        const query = await pool.query('INSERT INTO pages("userID", title, content, "pageID", time_created, username)' +
            ' VALUES($1, $2, $3, $4, $5, $6)',
            [userId, pageTitle, content, pageID, createdTime, username]);
        console.log('inserted page');
        res.json({pageID, currentContent: " ", msg: "inserted message" });
    } catch (err) {
        res.status(500).json({msg: "Error inserting page"});
        console.log(err.message);
    }
})

app.get('/getuserpages', async(req, res) => {
    let userID = req.query.userID;

    try {
        const {rows} = await pool.query('SELECT title, "pageID", time_created FROM pages WHERE' +
            ' "userID"' +
            ' = $1', [userID])



        res.json(rows)
    } catch (err) {
        console.log("getuserpages route error:", err.message);
    }

})

app.get('/getpage', async (req, res) => {

    let userID = req.query.userId;
    let pageTitle = req.query.pageTitle;

    try {
        const {rows} = await pool.query('SELECT * FROM pages WHERE "userID" = $1 AND title=$2', [userID, pageTitle]);

        res.json(rows[0]);

    } catch (err) {
        console.log(err.msg);
        res.status(500).json("oops error");
    }
})

app.patch('/savepagecontent', async(req, res) => {

    //need name
    //need pageTitle

    let pageID = req.body.pageId;
    let content = req.body.currentEditorContent;
    let pageTitle = req.body.pageTitle;

    let timeUpdated = new Date();


    try {
        console.log(pageID, content, pageTitle);
        const query = await pool.query('UPDATE pages SET content=$1 WHERE "pageID"=$2', [content, pageID]);
        res.json({ message: 'Page content updated successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json('oops girl something happened when saving..');
    }

})

app.get('/getpagecontent', async(req, res) => {
    let pageID = req.query.pageId;
    try {
        const {rows} = await pool.query(`SELECT content from pages WHERE "pageID" = $1`, [pageID]);
        res.json(rows[0].content);
    } catch (err) {
        console.log(err);
        res.status(500).json('oops girl something happened when getting content..');

    }
})

app.get('/deletepage', async(req, res) => {
    let pageID = req.query.pageId
    console.log('got request with this id', pageID)

    try {
        const query = await pool.query(`DELETE FROM pages WHERE "pageID" = $1`, [pageID]);
        res.json('complete');
    } catch (err) {
        console.log(err)
        res.status(500).json('oops something happened when deleting content..');
    }
})

app.get('/sharepage', async(req, res) => {
    const pageID = req.query.pageID;
    const ownerUsername = req.query.ownerusername;
    const shareUsername = req.query.shareusername


    try {
        const query = await pool.query(`INSERT INTO share_pages(page_id, share_with_username, owner_username) VALUES ($1, $2, $3)`, [pageID, shareUsername, ownerUsername])
        res.json('page shared');
    } catch (err) {
        console.log(err)
        res.status(500).json('err')
    }

})

app.get('/getsharedpages', async(req, res) => {

    const username = req.query.username

    try {
        const {rows} = await pool.query(`SELECT * from share_pages WHERE share_with_username=$1`, [username]);
        res.json(rows)
    } catch (err) {
        console.log(err);
        res.status(500).json('err getting shared pages')
    }

})

app.get('/checkaccess', async(req, res) => {
    const username= req.query.username;
    const pageID = req.query.pageID;

    console.log(pageID, username);

    try {

        let {rows} = await pool.query(`SELECT username, title FROM pages WHERE "pageID"=$1`, [pageID])
        let secondCheck = true;

        if (rows[0].username === username) {
            res.json({access: "Permitted", title: rows[0].title})
            secondCheck = false
        }

        if (secondCheck) {
             let {rows} = await pool.query(`SELECT owner_username, title, share_with_username FROM share_pages WHERE page_id=$1`, [pageID])
            console.log(rows);
            if (rows[0] && rows[0].share_with_username === username) {
                res.json({access: "Permitted", title: rows[0].title})
            } else res.json("Denied")
        }

    } catch (err) {
        console.log(err);
        res.status(500).json('err checking access')
    }
})

app.post('/savetitle', async (req, res) => {
    const title = req.body.title;
    const pageID = req.body.roomId;

    console.log('save title request with', title, pageID)
    try {
        const query = await pool.query(`UPDATE pages SET title=$1 WHERE "pageID"=$2`, [title, pageID])
        const query2 = await pool.query('UPDATE share_pages SET title=$1 WHERE page_id=$2', [title, pageID])

        res.json('updated titles')
    } catch (err) {
        console.log(err)
        res.status(500).json('err saving title')
    }

})

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

    // if (!roomState[roomID].users.includes(username)) {
    //     roomState[roomID].users.push(username)
    // }
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

    socket.on('titleChange', (data) => {
        io.to(roomID).emit("newTitle", (data))
    })

    socket.on('connected', (data) => {
        console.log(data);
    })
})


server.listen(3636);
