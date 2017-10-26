//console.log('notes.js');

//console.log(module);
// 이 module 객체 안의 exports를 쓰면,
// 파일들이 export된다.

//module.exports.age = 25;

const fs = require('fs');

var logNote = (note) => {

    //debugger;

    console.log('---');
    console.log(`Title : ${note.title}`);
    console.log(`Body : ${note.body}`);
}

let fetchNotes = () => {
    try {
        let notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch (e) {
        return [];
    }
}

let saveNotes = (notes) => {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes));

}

let addNote = (title, body) => {
    let notes = fetchNotes();
    let note = {
        title, // es6 syntax
        body
    };

    try {
        // if there's no file, app crashes.
        let notesString = fs.readFileSync('notes-data.json');
        notes = JSON.parse(notesString);
    }
    catch (e) {
        console.log(e);
    }

    let duplicateNotes = notes.filter(note => note.title === title); // dup은 어차피 하나 있을 것. 두개는 들어갈 수 없다.
    console.log('dup notes : ', duplicateNotes); // filter 시 callback의 기준으로 추가하게 된다.

    if (duplicateNotes.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note;

    }
};

let getAll = () => {
    return fetchNotes();
    // console.log('getting all notes.');
    //
    // let notes = fetchNotes();
    // for (let dat of notes) {
    //     logNote(dat);
    // }
};

let getNote = (title) => {
    console.log(`getting \"${title}\" notes.`);
    let notes = fetchNotes();
    let note = notes.filter(note => note.title === title)[0];
    return note;
};

let removeNote = (title) => {
    console.log(`getting \"${title}\" notes.`);

    let notes = fetchNotes();
    //let note = notes.filter(note => note.title === title)[0];
    let filteredNotes = notes.filter(note => note.title !== title);
    saveNotes(filteredNotes); // 좀 어이없지만..

    return notes.length !== filteredNotes.length; // check if note is deleted.
    //let idx = notes.findIndex(note);
    //notes.splice(idx, 1);
};

module.exports = {
    addNote, // 그냥 이렇게만 해도 된다.(ES6)
    getAll,
    getNote,
    removeNote,
    logNote
};

// module.exports.addNote = () => {
//     console.log('addNote');
//     return 'New note';
// };

// module.exports.add = (a, b) => {
//     return a + b;
// };