let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/todo');
const {ObjectID} = require('mongodb');

// this is for heroku deployment.
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`started up at port ${port}`);
});

module.exports = {app};