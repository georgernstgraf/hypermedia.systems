'use strict';
const express = require('express');
// Create the express app
const app = express();

const session = require('express-session');
const flash = require('express-flash');
app.use(
    session({
        name: 'session.cookie',
        secret: 'urxn',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
            sameSite: 'strict',
        },
    })
);
app.use(flash());

const fs = require('fs');
const { Contact } = require('./lib/contact');
const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8')).map(
    (_) => new Contact(_)
);
// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)
// Error handlers
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    if (!req.query.p) {
        req.query.p = 'search!';
    }
    res.render('index', req.query);
});
app.get('/contacts', (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    let data;
    if (req.query.q) {
        const q = req.query.q.toLowerCase();
        data = contacts.filter(
            (c) =>
                c.first.toLowerCase().includes(q) ||
                c.last.toLowerCase().includes(q) ||
                c.email.includes(q)
        );
    } else {
        data = contacts;
    }
    res.render('contacts', { contacts: data, messages: flashes?.info || [] });
});
app.get('/contacts/new', (req, res) => {
    return res.render('contacts/new', { contact: new Contact() });
});
app.post(
    '/contacts/new',
    express.urlencoded({ extended: true }),
    (req, res) => {
        const c = new Contact({
            id: null,
            first: req.body['first_name'],
            last: req.body['last_name'],
            phone: req.body['phone'],
            email: req.body['email'],
        });
        //
        if (c.first.includes('err')) {
            c.errors.first = 'First name cannot contain "err"';
            return res.render('contacts/new', { contact: c });
        }
        // no error here
        contacts.push(c);
        req.flash('info', 'Created New Contact!');
        return res.redirect('/contacts');
    }
);
///////////////////////////////////////////////////////////////
// use the "static" folder for static files
app.use('/', express.static('static'));
// Start server
app.listen(1234, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log(
        'Started at http://localhost:1234 ' + new Date().toLocaleTimeString()
    );
});
