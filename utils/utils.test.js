const expect = require('expect');
const utils = require('./utils');

describe('Utils', () => {
    describe('#add', () => {

        it('should add two numbers', () => {
            let res = utils.add(33, 11);

            expect(res).toBe(44).toBeA('number');

            // in toBeA, string or object can be.
            // if (res !== 44) {
            //     throw new Error(`Expected 44, but got ${res}`);
            // }
        }); // mocha function.
// behavior driven development. BDD. specify the behavior.

        it('should async add two numbers', (done) => {
            utils.asyncAdd(4, 3, (sum) => {
                expect(sum).toBe(7).toBeA('number');
                done();
                // mocha lets you know that if async takes really long time.
            });
        });
    })


    it('should square the number', () => {
        let testcase = 10;
        let res = utils.square(testcase);

        expect(res).toBe(testcase * testcase).toBeA('number');

        // if (res !== testcase * testcase) {
        //     throw new Error(`Exected ${testcase * testcase}, but got ${res}`);
        // }

        //let res = utils.square(10);

        //if (res !==)
    });

    it('should expect some values', () => {
        //expect(12).toNotBe(12);
        // expect({
        //     name : 'Andrew'
        // }).toEqual({
        //     name : 'Andrew'
        // });
        // if you use toBe, then it fails.

        //expect([2, 3, 4]).toInclude(2); // false.
        //expect([2, 3, 4]).toExclude(1); // true.

        expect({
            name : 'Andrew',
            age : 25,
            location : 'Philadelphia'
        }).toInclude({
            age : 25
        }).toExclude({
            age : 23
        });
    }); // this test works

    it('should verify that first and last name are set', () => {
        let user = {
            age : 25,
            location : "Philadelphia"
        };
        let res = utils.setName(user, "kim ilsik");

        expect(res).toEqual(user).toInclude({
            firstName : "kim",
            lastName : "ilsik"
        });
    });

    it('should async square a number', (done) => {
        utils.asyncSquare(10, (sq) => {
            expect(sq).toBe(100).toBeA('number');
            done();
        })
    })
});