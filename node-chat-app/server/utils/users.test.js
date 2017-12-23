const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id : '1',
                name : 'mike',
                room : 'node course'
            },
            {
                id : '2',
                name : 'jen',
                room : 'react course'
            },
            {
                id : '3',
                name : 'kim',
                room : 'node course'
            },
            {
                id : '4',
                name : 'song',
                room : 'react course'
            }
        ];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id : "abcbac123",
            name : "kim",
            room : "the office fans"
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        let user = users.removeUser('1');
        expect(user.id).toBe('1');
        expect(users.users.length).toBe(3);
    });

    it('should not remove a user', () => {
        // give a false id and check if it doesn't remove a user.
        let user = users.removeUser('123');
        expect(user).toBe(undefined);
        expect(users.users.length).toBe(4);
    })

    it('should find a user', () => {
        // get the object back.
        let user = users.getUser('1');
        expect(user).toEqual({
            id : '1',
            name : 'mike',
            room : 'node course'
        });
    });

    it('should not find a user', () => {
        // get the object back.
        let user = users.getUser('123');
        expect(user).toBe(undefined);
    })


    it('should return names for node course', () => {
        let userList = users.getUserList('node course');
        expect(userList).toEqual(['mike', 'kim']);
    });

    it('should return names for react course', () => {
        let userList = users.getUserList('react course');
        expect(userList).toEqual(['jen', 'song']);
    });
});