//
// hbs : partial - partial code of html
//
// nodemon server.js -e -> checkout the extension.
//
// ls -a : shows every hidden files ( . files, .. files, ..
//
// ** how can I remove node_modules files from already committed repo?
//
//
/*

id_rsa : it is private key.

add a new feature
-> /projects, /portfolio.



 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // for heroku, local


var app = express(); // express as a function.

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    // next : you can tell to express that the middleware function is done.
    let now = new Date().toString();
    let log = `${now} : ${req.method}, ${req.url}`; // logger

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) { // async without callback is deprecated.
            console.log("Unable to append to server.log ", err);
        }
    });// filename

    // you can print this message to the file.

    next(); // if you don't do this, then the homepage doesn't work.
});

// // maintenance.
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//     //next();
// });

// need to put this under maintenance middleware to restrict the access.
app.use(express.static(__dirname + '/public')); // middleware
// you can directly access to ~.html in public folder.

// bhs automatically checks getCurrentYear in the template page.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (req, res) => { // request, response

    // json data.
    // express automatically adds contents-type as application/json.
    res.render('home.hbs', {
        welcomeMessage : "Welcome to my home page",
        pageTitle : "Home page",
        //currentYear : new Date().getFullYear(),
        name : "Kim",
        likes : [
            'Biking',
            'Camping',
            'Sexing'
        ],
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle : "About page",
        //currentYear : new Date().getFullYear(),
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle : "Projects",
    });
})

app.get('/bad', (req, res) => {
    res.send({
        error: true,
        message: "Unable to fetch the data.",
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});