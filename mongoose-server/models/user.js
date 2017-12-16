let {mongoose} = require('mongoose');

let User = mongoose.model('user', { // user should be uppercase.
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    }
});

// let user = new User({
//     email : "my@email.com"
// });

// user.save().then(doc => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, e => console.log(e));

module.exports = {User};