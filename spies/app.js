let db = require('./db.js');

module.exports.handleSignup = (email, password) => {
    // check if email already exists.

    db.saveUser({email, password}); // ES 6 syntax.

    // save the user to the database.
    // save the welcome email.
}