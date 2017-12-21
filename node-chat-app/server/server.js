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
const {generateMessage, generateLocationMessage} = require('./utils/message');

// io is for all the users. socket is for one user.
io.on('connection', (socket) => {
    // socket is for individual user.
    console.log('new user connected.');
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // create event.
    // socket.emit('newEmail', {
    //     from : 'Song',
    //     text : "Hey, what's going on?",
    //     createdAt : new Date().getTime()
    // }); // with data.

    // socket.emit('newMessage', {
    //     from : "qwe",
    //     text : "asd",
    //     createdAt : new Date().getTime()
    // });

    // custom event from client.
    socket.on('createEmail', (newEmail) => {
        console.log('newemail : ', newEmail);
    });

    socket.on('newMessage', (message) => {


    });

    socket.on('createMessage', (message, callback) => {
        console.log('message : ', message);

        // new message events.
        // socket.emit from admin. text : welcome to the chat app.
        // socket.broadcast.emit -> everybody but the user. from admin. text : new user joined.

        // why not using socket.emit?
        io.emit('newMessage', generateMessage(message.from, message.text)); // to all users.
        callback('this is from the server.');

        // // everybody but this socket.
        // socket.broadcast.emit('newMessage', {
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        //socket.broadcast.emit('')
        io.emit('newLocationMessage', generateLocationMessage(
            'Admin',
            coords.latitude,
            coords.longitude
            // 'Admin', `lat : ${coords.latitude}, lng : ${coords.longitude}`)
        ));
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