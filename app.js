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
    const flashes = req.session.flash;
    delete req.session.flash;
    const options = { p: req.query.p || 'search!', flashes: flashes };
    res.render('index', options);
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
    res.render('contacts', { contacts: data, flashes: flashes });
});

app.get('/contacts/new', (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    return res.render('contacts/new', {
        contact: new Contact(),
        flashes: flashes,
        errors: {},
    });
});
app.get('/contacts/:id/edit', (req, res) => {
    const contact = contacts.find((c) => c.id === req.params.id);
    if (!contact) {
        return res.status(404).send('Contact not found');
    }
    const flashes = req.session.flash;
    delete req.session.flash;
    return res.render('contacts/edit', {
        contact: contact,
        errors: {},
        flashes: flashes,
    });
});
app.post(
    '/contacts/:id/edit',
    express.urlencoded({ extended: true }),
    (req, res) => {
        const flashes = req.session.flash;
        delete req.session.flash;
        const contact = contacts.find((c) => c.id === req.params.id);
        if (!contact) {
            return res.status(404).send('Contact not found');
        }
        try {
            contact.update(req.body);
            req.flash('info', 'Updated Contact!');
            return res.redirect('/contacts/' + contact.id);
        } catch (e) {
            req.flash('error', e.message);
            return res.render('contacts/edit', {
                contact: contact,
                errors: e.details || {},
                flashes: flashes,
            });
        }
    }
);
app.get('/contacts/:id', (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    const contact = contacts.find((c) => c.id === req.params.id);
    if (!contact) {
        return res.status(404).send('Contact not found');
    }
    return res.render('contacts/view', { contact: contact, flashes: flashes });
});

app.post(
    '/contacts/new',
    express.urlencoded({ extended: true }),
    (req, res) => {
        const flashes = req.session.flash;
        delete req.session.flash;
        let newContact;
        try {
            newContact = new Contact({
                id: null,
                first: req.body['first'],
                last: req.body['last'],
                phone: req.body['phone'],
                email: req.body['email'],
            });
            newContact.addSelf(contacts);
            req.flash('info', 'Created New Contact!');
            return res.redirect('/contacts');
        } catch (e) {
            req.flash('error', e.message);
            return res.render('contacts/new', {
                contact: newContact,
                errors: e.details,
                flashes: flashes,
            });
        }
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
