let env = process.env.NODE_ENV || 'development'; // used only in heroku.
// console.log('env **** ', env);

// if you require() json file, then it automatically parsed into javascript object.
if (env === 'development' || env === 'test') {
    let config = require('./config.json');
    //console.log(config);
    let envConfig = config[env]; // test or development.

    console.log(Object.keys(envConfig)); // returns it an array.
    Object.keys(envConfig).forEach(key => {
        // deal env as an array.
        process.env[key] = envConfig[key];
    });
}

//
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     // use different database so we don't wipe out existing data.
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }