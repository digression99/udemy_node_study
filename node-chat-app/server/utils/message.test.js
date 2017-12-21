const expect = require('expect');
let {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
    it('should generate correct location object', (done) => {
        let from = 'admin', lat = 1, lng = 1;
        let url = `https://www.google.com/maps?q=${lat},${lng}`;
        let message= generateLocationMessage(from, lat, lng);

        expect(message).toMatchObject({
            from,
            url
        });
        expect(typeof message.createdAt).toBe('number');
        done();
    });
});