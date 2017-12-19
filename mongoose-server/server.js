require('./config/config');

const _ = require('lodash');

const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

const {ObjectID} = require('mongodb');

// this is for heroku deployment.
const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

// resource creation.
app.post('/todos', authenticate, (req, res) => {

    let todo = new Todo({
        text : req.body.text,
        _creator : req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    // pick the content and add it to body.
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("id is invalid.");
    }

    // if it's boolean and and it's true,
    if(_.isBoolean(body.completed) && body.completed) {
        console.log("boolean indeed.");
        body.completed = true;
        body.completedAt = new Date().getTime(); // returns a javascript timestamp. reg number.
    } else {
        console.log("boolean indeed not.");
        body.completed = false;
        body.completedAt = null;
    }

    // use find one and update.
    Todo.findOneAndUpdate({
        _id : id,
        _creator : req.user._id
    }, {$set : body}, {new : true})
        .then((todo) => {
            if (!todo) {
                return res.status(404).send("todo doesn't exist.");
            }
            console.log(todo);
            // es6 syntax.
            res.send({todo});
        })
        .catch(e => {
            res.status(400).send(e);
        })
});

app.get('/todos/:id', authenticate, (req, res) => {
    //req.params;
    let id = req.params.id;

    // valid id using isValid.
    // if it's not valid, stop the function and return 404.
    // res.status(404).send(e);
    // if it's valid, response with the object.
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid.");
    }

    //Todo.findById(id)
    Todo.findOne({
        _id : id,
        _creator : req.user._id
    })
        .then(todo =>  {
            if (!todo) return res.status(404).send("No todo found.");

            res.status(200).send({todo});
            // why object? because it's more scalable.
        })
        .catch(e => res.status(404).send(e));
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator : req.user._id // you can get this in authenticate.
    }).then((todos) => {
        res.send({
            todos,
            code : "lalala"
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send("ID is not valid");
    }

    //Todo.findByIdAndRemove(id)
    Todo.findOneAndRemove({
        _id : id,
        _creator : req.user._id
    })
        .then((todo) => {
        if (!todo) {
            return res.status(404).send("No todo found.");
        }
        return res.status(200).send({todo});
    }).catch(e => {
        return res.status(400).send(e);
    });
});


// middleware.
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', (req, res) => {
    let user = new User(_.pick(req.body, ['email', 'password']));

    //Model
    // User.findByToken.
    // instance. individual document.
    // user
    // user.generateAuthToken.

    user.save()
        .then(() => {
        return user.generateAuthToken();
        //res.send(doc);
    })
        .then((token) => {
        res.header('x-auth', token).send(user);
    })
        .catch(e => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user); // set x-auth.
        });

        //res.send(user);
    }).catch(e => {
        res.status(400).send();
    });
    // User.find({'email' : body.email})
    //     .then((user) => {
    //         bcrypt.genSalt(10, (err, salt) => {
    //             bcrypt.hash(body.password, salt, (err, hash) => {
    //
    //                 //console.log('user : ', user);
    //                 bcrypt.compare(hash, user[0].password, (err, result) => {
    //                     if (err) {
    //                         console.log(err);
    //                         return res.status(401).send(err);
    //                     }
    //                     res.status(200).send(user);
    //                 });
    //             });
    //         });
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         return res.status(400).send(e);
    //     })
});

app.delete('/users/me/token', authenticate, (req, res) => {
    // log out by deleting jwt.
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send("Job done.");
        })
        .catch(e => {
            res.status(400).send();
        });
});

app.listen(port, () => {
    console.log(`started up at port ${port}`);
});

module.exports = {app};