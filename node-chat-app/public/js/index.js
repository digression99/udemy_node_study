let socket = io(); // initiate the request.
// socket is critical to communicating.

socket.on('connect', () => {
    console.log('connected to server');

    // when connected, emit createEmail event.
    socket.emit('createEmail', {
        to : 'kim@kim.com',
        text : 'Hey, fuck you.'
    });

    // socket.emit('createMessage', {
    //     from : "baba",
    //     text : "dada"
    // });
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
    
    let li = jQuery('<li></li>'); // list item.
    li.text(`${message.from} : ${message.text}`);

    // append : add it as the last child.
    jQuery('#messages').append(li);
});

//
// socket.emit('createMessage', {
//     from : "Frank",
//     text : "hi"
// }, (data) => {
//     // this is the acknowledgement from the server.
//     // the message is very important.
//     console.log('got it,', data); // ack to client.
// });

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault(); // prevent default event.

    socket.emit('createMessage', {
        from : 'User',
        text : jQuery('[name=message]').val() // select anything that has an attribute name.
    }, (message) => {
        console.log("from server : ", message);
    });
});