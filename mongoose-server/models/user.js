const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id : user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    // return another promise.
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            //bcrypt only support callback.
            // so, we just return promise with the result.

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            })

            // bcrypt.genSalt(10, (err, salt) => {
            //     bcrypt.hash(password, salt, (err, hash) => {
            //         bcrypt.compare(hash, user.password, (err, result) => {
            //             console.log("result : ", result);
            //             if (err) {
            //                 //onsole.log(err);
            //                 reject(err);
            //                 //console.log(err);
            //                 // return res.status(401).send(err);
            //             }
            //             resolve(user);
            //             //res.status(200).send(user);
            //         });
            //     });
            // });
            //
        });
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull : { // remove data from the documents.
            tokens : {token}
        }
    });
};

// instance
// use function keyword to access this.
UserSchema.statics.findByToken = function (token) {
    var User = this; // model with this.
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    // if successfully decoded,
    // return promise.
    return User.findOne({
        '_id' : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    })
};

// attach event before save event.
UserSchema.pre('save', function (next) {
    var user = this;

    // only do this when the password is modified.
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        // if it is not modified.
        next();
    }
});







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