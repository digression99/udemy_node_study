let mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Number, // unix time stamp.
        default : null
    }
});

// let newTodo = new Todo({
//     text : 'Cook dinner'
// });

// let newTodo = new Todo({
//     text : 'kill the fucking rat3',
//     completed : false,
//     completedAt : new Date().getFullYear()
// });
//
// newTodo.save().then((doc) => {
//     //console.log('Saved todo', doc);
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save todo');
// });

//__ v is changed over time.
// validator : set default value or required value.
// schema vs just model?

//
// let otherTodo = new Todo({
//     text : 'edit this video',
//     completed : false,
//     completedAt : new Date().getFullYear()
// });
//
// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log(e);
// });

module.exports = {Todo};