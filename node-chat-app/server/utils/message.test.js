const expect = require('expect');
let {generateMessage} = require('./message');

// function test.
describe('generateMessage', () => {
    it('should generate correct message object', (done) => {
        // store response in variables.
        // assert from match.
        // assert text matches up.
        // assert createdAt is number.
        let from = "kim@kim.com";
        let text = "hi there.";
        let message = generateMessage(from, text);

        //expect(message.from).toBe(from);
        //expect(message.text).toBe(text);
        expect(typeof message.createdAt).toBe('number');

        expect(message).toMatchObject({
            from, text
        });

        done();
    });
});