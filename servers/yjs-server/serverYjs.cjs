const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.cjs').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1235

const serverYjs = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
})

wss.on('connection', setupWSConnection)

serverYjs.on('upgrade', (request, socket, head) => {
    const handleAuth = ws => {
        wss.emit('connection', ws, request)
    }
    wss.handleUpgrade(request, socket, head, handleAuth)
})

serverYjs.listen(port, host, () => {
    console.log(`running at '${host}' on port ${port}`)
})