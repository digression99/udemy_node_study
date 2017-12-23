// [{
//     id : "asdfasdf",
//     name : "kim",
//     room : "the office fans"
// }]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

// class Person {
//     constructor(name, age) {
//         // do not need to manually call it.
//         // console.log(name, age);
//
//         // dynamically set the member.
//         this.name = name;
//         this.age = age;
//     }
//
//     getUserDescription() {
//         return `${this.name} is ${this.age} year(s) old.`;
//     }
// }

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // return user that was removed.
        let user = this.getUser(id);//this.users.filter(user => user.id === id)[0]; // filter returns array.
        this.users = this.users.filter(user => user.id !== id);

        //let index = this.users.indexOf(user => user.id === id);
        //this.users.splice(index, 1);

        return user; // [] automatically accepts as an undefined.
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUserList(room) {
        let users = this.users.filter(user => user.room === room);
        let namesArray = users.map(user => user.name);

        return namesArray;
    }
}

module.exports = {Users};