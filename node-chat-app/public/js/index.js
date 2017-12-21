let socket = io(); // initiate the request.
// socket is critical to communicating.

socket.on('connect', () => {
    console.log('connected to server');

    // when connected, emit createEmail event.
    socket.emit('createEmail', {
        to : 'kim@kim.com',
        text : 'Hey, fuck you.'
    });

    socket.emit('createMessage', {
        from : "baba",
        text : "dada"
    });
});

socket.on('disconnect', () => {
    console.log('disconnected from server.');
});

// custom event.
socket.on('newEmail', (email) => {
    console.log('email : ', email);
    //console.log('new email');
});

socket.on('newMessage', (message) => {
    console.log('message : ', message);
});