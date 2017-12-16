let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/todo');

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

app.listen(3000, () => {
    console.log('started on port 3000');
});

module.exports = {app};