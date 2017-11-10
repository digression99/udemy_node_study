const request = require('supertest');
const expect = require('expect');


let app = require('./server').app; // .app을 해주는 이유는? module에서 app을 얻어오는 것이므로

describe('Server', () => {

    describe('GET /', () => {
        it('should return hello world response', (done) => {
            request(app)
                .get('/')
                //.expect(200) // ok status code
                .expect(404)
                //.expect('hello world')
                //.expect({
                //    error : 'Page not found.'
                //})
                .expect((res) => { // super flexible test.
                    expect(res.body).toInclude({
                        error : 'Page not found.'
                    });
                })
                .end(done);
        });
    })

    describe('GET /users', () => {
        it('should return my user property', (done) => {
            request(app).get('/users').expect(200).expect((res) => {
                expect(res.body).toInclude({
                    name : "Kim",
                    age : 26
                });
            })
                .end(done); // if you don't do this, then test never passes.
        })
    })
})
