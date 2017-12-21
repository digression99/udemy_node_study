const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const http = require('http');
const socketIO = require('socket.io');
// http server is used in express behind the scene, so we just pass in app.
const server = http.createServer(app);
let io = socketIO(server);

const path = require('path');
app.use(express.static(path.join(__dirname, '../public'))); // middleware

io.on('connection', (socket) => {
    // socket is for individual user.
    console.log('new user connected.');

    // create event.
    socket.emit('newEmail', {
        from : 'Song',
        text : "Hey, what's going on?",
        createdAt : new Date().getTime()
    }); // with data.

    socket.emit('newMessage', {
        from : "qwe",
        text : "asd",
        createdAt : new Date().getTime()
    });

    // custom event from client.
    socket.on('createEmail', (newEmail) => {
        console.log('newemail : ', newEmail);
    });

    socket.on('createMessage', (message) => {
        console.log('message : ', message);
    });

    // do something when user is disconnected.
    // can you fetch user's information?
    socket.on('disconnect', () => {
        console.log('user disconnected from server.');
    });
}); // register an event listener.

// app.get('/', (req, res) => {
//     res.render('index');
// });

//app.listen(PORT, () => {
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});