/*

yargs -> 커맨드 라인에서 입력받은 것을 파싱하는 모듈.

 */



const fs = require('fs'); // built-in modules.
const os = require('os');
const notes = require('./notes');
const _ = require('lodash');
const yargs = require('yargs');

let titleOptions = {
    describe : "Title of note.",
    demand : true,
    alias : 't',
};

let bodyOptions = {
   describe : "Body of note.",
   demand : true,
   alias : 'b'
};

//let yargsArgv = yargs.argv;
let yargsArgv = yargs
    .command('add', 'Add a new notes', { // set a command.
        title : titleOptions,
        body : bodyOptions
    })
    .command('list', 'List all notes.')
    .command('read', 'Read a note.', {
        title : titleOptions
    })
    .command('remove', 'Remove a note.', {
        title : titleOptions
    })
    .help()
    .argv;// send some useful info.

let command = yargsArgv._[0];
//console.log(process.argv); // argv : arguments vector.
// node app.js remove --title="secrets 2" // double quotes로 한다

console.log('Command : ', command);
console.log('Yargs : ', yargsArgv);
console.log('Process argv : ', process.argv);

if (command === 'add') {
    console.log('Adding new note');

    let note = notes.addNote(yargsArgv.title, yargsArgv.body);
    if (note === undefined) {
        console.log("Something bad happened."); // note title taken.
    } else { // if (note)
        console.log("Note created.");
        notes.logNote(note);
    }
} else if (command === 'list') {
    let allNotes = notes.getAll();

    console.log(`Printing ${allNotes.length} note(s).`);

    allNotes.forEach(note => notes.logNote(note));

    //
    // allNotes.forEach((note) => {
    //     notes.logNote(note);
    // });


    //for (note of allNotes)


    //console.log('Listing all notes.');
} else if (command === 'read') {
    //console.log('Reading note.');

    let note = notes.getNote(yargsArgv.title);
    if (note) {
        notes.logNote(note);
        //console.log(note);
    } else {
        console.log("note not found.");
    }
} else if (command === 'remove')
{
    console.log('Removing note.');
    let noteRemoved = notes.removeNote(yargsArgv.title);
    let message = noteRemoved ? 'Note is removed.' : 'Note not found.';

    console.log(message);
} else {
    console.log('Command not recognized.');
}


