const expect = require('expect');
const {isRealString} = require('./validation');

// function test.
describe('isRealString', () => {
    it('should reject non-string values', (done) => {
        let dummy = {name : "kim", text : "hello"};
        let bool = isRealString(dummy);
        expect(bool).toBe(false);
        done();
    });

    it('should reject string with only spaces', (done) => {
        let dummy = "         ";
        let bool = isRealString(dummy);
        expect(bool).toBe(false);
        done();
    });

    it('should allow string with non-space characters', (done) => {
        let dummy = "    qwe qweqwe ";
        let bool = isRealString(dummy);
        expect(bool).toBe(true);
        done();
    });
});