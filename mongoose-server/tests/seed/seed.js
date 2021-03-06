const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id : userOneId,
    email : 'kim@kim.com',
    password : 'userOnePass',
    tokens : [
        {
            access : 'auth',
            token : jwt.sign({
                _id : userOneId,
                access : 'auth'
            }, process.env.JWT_SECRET).toString()
        }
    ]
},{
    _id : userTwoId,
    email : 'jen@example.com',
    password : 'userTwoPass',
    tokens : [
        {
            access : 'auth',
            token : jwt.sign({
                _id : userTwoId,
                access : 'auth'
            }, process.env.JWT_SECRET).toString()
        }
    ]
}];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save(); // promise.
            let userTwo = new User(users[1]).save();

            // wait for all the promises to complete.
            Promise.all([userOne, userTwo])
                .then(() => {
                    done();
                });
        });
};

const todos = [
    {
        _id : new ObjectID(),
        text : "first test todo",
        completed : false,
        completedAt : null,
        _creator : userOneId,
    },
    {
        _id : new ObjectID(),
        text : "second test todo",
        completed : true,
        completedAt : 333,
        _creator : userTwoId,
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};