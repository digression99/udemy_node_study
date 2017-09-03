/*

yargs -> 커맨드 라인에서 입력받은 것을 파싱하는 모듈.





 */



const fs = require('fs'); // built-in modules.
const os = require('os');
const notes = require('./notes');
const _ = require('lodash');
const yargs = require('yargs');

let yargsArgv = yargs.argv;

let command = yargsArgv._[0];
//console.log(process.argv); // argv : arguments vector.
// node app.js remove --title="secrets 2" // double quotes로 한다

console.log('Command : ', command);
console.log('Yargs : ', yargsArgv);
console.log('Process argv : ', process.argv);

if (command === 'add') {
    console.log('Adding new note');

    notes.addNote(yargsArgv.title, yargsArgv.body);

} else if (command === 'list') {
    notes.getAll();

    console.log('Listing all notes.');
} else if (command === 'read') {
    notes.getNote(yargsArgv.title);
    console.log('Reading note.');
} else if (command === 'remove') {
    notes.removeNote(yargsArgv.title);
    console.log('Removing note.');
} else {
    console.log('Command not recognized.');
}


