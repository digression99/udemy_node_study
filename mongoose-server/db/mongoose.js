let mongoose = require('mongoose');

//mongodb://<dbuser>:<dbpassword>@ds159856.mlab.com:59856/testdb3

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};