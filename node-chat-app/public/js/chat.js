let socket = io(); // initiate the request.
// socket is critical to communicating.

scrollToBottom = () => {
    // selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // heights
    let clientHeight = messages.prop('clientHeight'); // cross brower attribute.
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
        //console.log('should scroll');
    }
};

socket.on('connect', () => {
    //console.log('connected to server');

    let params = jQuery.deparam(window.location.search);

    // send in join.
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/'; // go back. redirection.
        } else {
            console.log('no error');
        }
    });

    // when connected, emit createEmail event.
    // socket.emit('createEmail', {
    //     to : 'kim@kim.com',
    //     text : 'Hey, fuck you.'
    // });

});

socket.on('disconnect', () => {
    console.log('disconnected from server.');
});

socket.on('updateUserList', (users) => {
    console.log('users list', users);

    let ol = jQuery('<ol></ol>');
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

// custom event.
socket.on('newEmail', (email) => {
    console.log('email : ', email);
    //console.log('new email');
});

socket.on('newMessage', (message) => {

    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    //let formattedTime = moment(message.createdAt).format('h:mm a');

    // let li = jQuery('<li></li>'); // list item.
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // // append : add it as the last child.
    // jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault(); // prevent default event.

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
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

    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        from : message.from,
        createdAt : formattedTime,
        url : message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();


    // let li = jQuery('<li></li>'); // list item.
    // let a = jQuery(`<a target="_blank">My Current Location</a>`); // blank means open up the new tab.
    // let formattedTime = moment(message.createdAt).format('h:mm a');
    //
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // //li.text(`${message.from} : ${message.text}`);
    //
    // // append : add it as the last child.
    // li.append(a);
    // jQuery('#messages').append(li);
});

