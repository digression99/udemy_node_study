const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [
    {
        _id : new ObjectID(),
        text : "first test todo"
    },
    {
        _id : new ObjectID(),
        text : "second test todo"
    }
];

// run some code before test so it should be succeed.
// it makes the environment of the test.
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    // everything should be expected.
    it('should create a new todo', (done) => {
        // done : everything is as expected.
        let text = "test todo text";

        request(app)
            .post('/todos')
            .send({ // supertest does the job.
                text
            })
            .expect(200)
            .expect((res) => {
            expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
            if (err) {
                return done(err); // return stops the function execution.
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
            });
    });

    // beforeEach((done) => {
    //     Todo.remove({}).then(() => done());
    // });

    it('should not create todo with invalid body data', (done) => {

        let text = "";
        request(app)
            .post('/todos')
            .send({ // supertest does the job.
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err); // return stops the function execution.
                }

                Todo.find().then((todos) => {

                    expect(todos.length).toBe(2);
                    //expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    })
});

describe('GET /todos', () => {
    it ('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => { // custom assertion.
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('should return todo doc.', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 status back.
        let id = todos[0]._id.toHexString();

        id = id.replace("5", "8");

        // id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if non-object ids', (done) => {
        // /todos/123
        let id = 123;
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //query database using findById
                // should get nothing back.
                // toNotExist
                // expect(null).toNotExist(); // todo Argument.
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    return done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 status back.
        let id = todos[0]._id.toHexString();

        id = id.replace("5", "8");

        // id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if object id is invalid.', (done) => {
        // /todos/123
        let id = 123;
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});