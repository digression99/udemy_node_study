let env = process.env.NODE_ENV || 'development'; // used only in heroku.
// console.log('env **** ', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    // use different database so we don't wipe out existing data.
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}