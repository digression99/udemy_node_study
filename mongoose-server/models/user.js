const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// user object
// let testuser = {
//     email : "me@me.com",
//     password : 'fadsfa@!#@$1231dsfs',
//     tokens : [{
//         access : 'auth',
//         token : 'shfsdfsdf'
//     }]
// };

let UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true, // make it unique.
        validate: {
            validator : validator.isEmail, // work on it's own.
            message : '{value} is not a valid number'
        }
    },
    password : {
        type : String,
        require : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

// override.
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); // mongoose var to javascript object.

    return _.pick(user, ['_id', 'email']); // leave password and tokens.
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    // return another promise.
    return user.save().then(() => {
        return token;
    });
};

let User = mongoose.model('User', UserSchema);
// let User = mongoose.model('User', { // user should be uppercase.
//     email : {
//         type : String,
//         required : true,
//         minlength : 1,
//         trim : true,
//         unique : true, // make it unique.
//         validate: {
//             validator : validator.isEmail, // work on it's own.
//             message : '{value} is not a valid number'
//         }
//     },
//     password : {
//         type : String,
//         require : true,
//         minlength : 6
//     },
//     tokens : [{
//         access : {
//             type : String,
//             required : true
//         },
//         token : {
//             type : String,
//             required : true
//         }
//     }]
// });

// let user = new User({
//     email : "my@email.com"
// });

// user.save().then(doc => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, e => console.log(e));

module.exports = {User};