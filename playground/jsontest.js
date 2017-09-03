

/*
var obj = {

    name : "Kim"
};

var stringObj = JSON.stringify(obj);

console.log(obj);
console.log(typeof stringObj);
console.log(stringObj);

var personString = '{"name" : "Kim", "age" : "27"}';
let personObj = JSON.parse(personString);

console.log(personObj);
console.log(typeof personObj);
*/

const fs = require('fs');

var originalNote = {
    title : "Some title",
    body : "Boooody"
};

let originalNoteString = JSON.stringify(originalNote);

// originalNoteString
fs.writeFileSync('notes.json', originalNoteString);

var noteString = fs.readFileSync('notes.json');
// note

let note = JSON.parse(noteString);

console.log(typeof note);
console.log(note.title);

