let {User} = require('./../models/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // similar to response.header. fetch x-auth.

    User.findByToken(token) // user related to the token.
        .then((user) => {
            if (!user) {
                //res.status(401).send();
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            //res.send(user);
            next();
        })
        .catch(e => {
            //401 : authentication required.
            res.status(401).send(e);
        });
}

module.exports = {authenticate};