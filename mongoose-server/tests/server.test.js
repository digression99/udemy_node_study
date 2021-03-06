const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// run some code before test so it should be succeed.
// it makes the environment of the test.
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    // everything should be expected.
    it('should create a new todo', (done) => {
        // done : everything is as expected.
        let text = "test todo text";

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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

    it('should not create todo with invalid body data', (done) => {
        let text = "";
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => { // custom assertion.
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('should return todo doc.', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo doc created by other user.', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token) // other user's token passed.
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 status back.
        //let id = todos[0]._id.toHexString();

        //id = id.replace("5", "8");
        let hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if non-object ids', (done) => {
        // /todos/123
        let id = 123;
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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
                    expect(todo).toBeFalsy();
                    //expect(todo).toNotExist();
                    return done();
                }).catch(e => done(e));
            });
    });

    it('should not remove a todo', (done) => {
        let hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy(); // deletion should never happen.
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('should return 404 if object id is invalid.', (done) => {
        // /todos/123
        let id = 123;
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('/PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item.
        // update text, set completed true.
        // 200
        // text is changed,completed is true, completedAt is a number. .toBeA...
        let id = todos[0]._id.toHexString();
        let body = {
            text : "updated to true!",
            completed : true
        };
        // auth as first user.
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                //expect(res.body.todo.completedAt).toBeA("number");
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not update the todo', (done) => {
        let id = todos[0]._id.toHexString();
        let body = {
            text : "updated to true!",
            completed : true
        };
        // auth as second user.
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed.',(done) => {
        let id = todos[1]._id.toHexString();
        let body = {
            text : "updated to false!",
            completed : false
        };
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token) // set the header.
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated.', (done) => {

        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                // check if the body is empty.
                expect(res.body).toEqual({});
            })
            .end(done);

    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password}) // send the data with post request.
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            //.end(done);
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(e => done(e));
            });
    });

    // get 400
    it('should return validation errors if request invalid', (done) => {
        let email = "1";
        let password = "1";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
    // get 400
    it('should not create user if email in use', (done) => {
        let email = users[0].email;
        let password = "s123dfsdf";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy(); // if the token exists.
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    // something to contain. not to be exactly equal.
                    // toObject to change mongoose object to javascript object.
                    expect(user.toObject().tokens[1]).toMatchObject({
                        // should include these.
                        access : 'auth',
                        token : res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
            });
    });

    it('should reject invalid login.', (done) => {
        //expect 400
        // token toNotExist
        // no token created.
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email + '1',
                password : users[1].password
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy(); // if the token exists.
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    //expect(user.tokens[0]).toNotExist();
                    expect(user.tokens.length).toBe(1);

                    done();
                }).catch(e => done(e));
            });

    });
});

describe('DELETE /users/me/token', () => {

    it('should remove token on logout', (done) => {
        // DELETE /users/me/token
        // Set x-auth equal to token
        // 200 back.
        // asynchronous assertion.
        // find user, verify that tokens array has length of zero.

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token) // set the header.
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                })
                    .catch(e => done(e));
            });
    });
});