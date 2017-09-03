//console.log('notes.js');

//console.log(module);
// 이 module 객체 안의 exports를 쓰면,
// 파일들이 export된다.

//module.exports.age = 25;

let addNote = (title, body) => {
    console.log('Adding note', title, body);
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