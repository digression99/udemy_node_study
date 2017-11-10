
const expect = require('expect');
const rewire = require('rewire');

let app = rewire('./app');
//app.__set__
//app.__get__

describe('App', () => {

    let db = {
        saveUser : expect.createSpy()
    }
    app.__set__('db', db); // switch with db

    it('should call the spy correctly', () => {
        let spy = expect.createSpy();
        spy('Andrew', 25);
        //expect(spy).toHaveBeenCalled(); // tests if the spy ever called.
        expect(spy).toHaveBeenCalledWith('Andrew', 25); // change db with spy.
    })

    it('should call save user with user object', () => {
        let email = "kim@kim.com";
        let password = "123acb";

        app.handleSignup(email, password);
        expect(db.saveUser).toHaveBeenCalledWith({email, password}); // ES 6 syntax

    })
})