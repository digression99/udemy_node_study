let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0; // check whitespace.
};

module.exports = {isRealString};