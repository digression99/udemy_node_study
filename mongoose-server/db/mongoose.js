let mongoose = require('mongoose');

//mongodb://<dbuser>:<dbpassword>@ds159856.mlab.com:59856/testdb3

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};

// heroku sets this as production in default.
process.env.NODE_ENV === 'production';
process.env.NODE_ENV === 'development';
// with mocha
process.env.NODE_ENV === 'test';