const express = require('express');

let app = express();

app.get('/', (req, res) => {
    //res.status(200).send('hello world');
    res.status(404).send({
        error : 'Page not found.',
        name : 'Todo App v1.0'
    });
});

app.get('/users', (req, res) => {
    res.status(200).send([{
        name : "Kim",
        age : 26,
    },{
        name : "Koo",
        age : 25
    }]);
});

app.listen(3001, () => {
    console.log("server running on 3001");
});

module.exports.app = app; // you can access this from other files.