require('./config/config');

const _ = require('lodash');

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
app.post('/todos', (req, res) => {

    let todo = new Todo({
        text : req.body.text
    });

    //console.log(req.body);
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
        //res.send(e);
    });

    //res.send('great!');
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set : body}, {new : true})
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

app.get('/todos/:id', (req, res) => {
    //req.params;
    let id = req.params.id;

    // valid id using isValid.
    // if it's not valid, stop the function and return 404.
    // res.status(404).send(e);
    // if it's valid, response with the object.
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid.");
    }

    // find by id.
        // success case and error case.
        // if success,
            // if todo - send it back.
            // if no todo - send back 404 with empty body.
        // if error,
            // 400 - send empty body.
    Todo.findById(id)
        .then(todo =>  {
            if (!todo)
                return res.status(404).send("No todo found.");

            res.status(200).send({todo});
            // why object? because it's more scalable.
        })
        .catch(e => res.status(404).send(e));
    // }, e => {
    //     res.status(400).send(e);
    // });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos,
            code : "lalala"
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send("ID is not valid");
    }

    // remove todo by id.
        // success
            // if not doc, send 404.
            // if doc, send doc back with 200.
        // error
            // 400 with empty body.
    Todo.findByIdAndRemove(id).then((todo) => {
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

app.listen(port, () => {
    console.log(`started up at port ${port}`);
});

module.exports = {app};