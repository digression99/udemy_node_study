//console.log('notes.js');

//console.log(module);
// 이 module 객체 안의 exports를 쓰면,
// 파일들이 export된다.

//module.exports.age = 25;

const fs = require('fs');

let addNote = (title, body) => {
    let notes = [];
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

    let duplicateNotes = notes.filter(note => note.title === title);
    console.log('dup notes : ', duplicateNotes); // filter 시 callback의 기준으로 추가하게 된다.

    if (duplicateNotes.length === 0) {
        notes.push(note);
        fs.writeFileSync('notes-data.json', JSON.stringify(notes));
    }
};

let getAll = () => {
    console.log('getting all notes.');
};

let getNote = (title) => {
    console.log(`getting \"${title}\" notes.`);
};

let removeNote = (title) => {
    console.log(`getting \"${title}\" notes.`);
};

module.exports = {
    addNote, // 그냥 이렇게만 해도 된다.(ES6)
    getAll,
    getNote,
    removeNote
};

// module.exports.addNote = () => {
//     console.log('addNote');
//     return 'New note';
// };

// module.exports.add = (a, b) => {
//     return a + b;
// };