const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// run some code before test so it should be succeed.
// it makes the environment of the test.
beforeEach((done) => {
    Todo.remove({}).then(() => done());
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

            Todo.find().then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
            });
    });

    beforeEach((done) => {
        Todo.remove({}).then(() => done());
    });

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

                    expect(todos.length).toBe(0);
                    //expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    })
});