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

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from : 'User',
        text : messageTextbox.val() // select anything that has an attribute name.
    }, () => {
        //console.log("from server : ", message);
        messageTextbox.val('');  // set it to the empty value.
    });
});

// this might be more cheap.
let locationButton = jQuery('#send-location');
//jQuery('#send-location').on();

locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('gelocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('sending location ...');

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
        locationButton.removeAttr('disabled').text('send location');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, () => { // if something goes wrong.
        locationButton.removeAttr('disabled').text('send location');
        alert('Unable to fetch location');
    });
});

socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>'); // list item.
    let a = jQuery(`<a target="_blank">My Current Location</a>`); // blank means open up the new tab.

    li.text(`${message.from} : `);
    a.attr('href', message.url);
    //li.text(`${message.from} : ${message.text}`);

    // append : add it as the last child.
    li.append(a);
    jQuery('#messages').append(li);
});

