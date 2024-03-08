'use strict';
const express = require('express');
// Create the express app
const app = express();
const { prisma } = require('./lib/prisma');
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
const { Contact } = require('./lib/contact');
// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)
// Error handlers
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    const options = { p: req.query.p || 'eli', flashes: flashes };
    res.render('index', options);
});
app.get('/contacts', async (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    let data;
    if (req.query.q) {
        const q = req.query.q.toLowerCase();
        data = await prisma.contact.findMany({
            where: {
                OR: [
                    { email: { contains: q } },
                    { first: { contains: q } },
                    { last: { contains: q } },
                ],
            },
        });
    } else {
        data = await prisma.contact.findMany();
    }
    data = data.map((c) => new Contact(c, true));
    res.render('contacts', { contacts: data, flashes: flashes });
});
app.get('/contacts/new', (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    return res.render('contacts/edit', {
        contact: new Contact(),
        flashes: flashes,
    });
});
app.get('/contacts/:id/edit', async (req, res) => {
    const contact = new Contact(
        await prisma.contact.findUnique({
            where: { id: req.params.id },
        }),
        true
    );
    if (!contact) {
        return res.status(404).send('Contact not found');
    }
    const flashes = req.session.flash;
    delete req.session.flash;
    return res.render('contacts/edit', {
        contact: contact,
        flashes: flashes,
    });
});
app.post(
    '/contacts/:id/edit',
    express.urlencoded({ extended: true }),
    async (req, res) => {
        const flashes = req.session.flash;
        delete req.session.flash;
        let contact = new Contact(
            await prisma.contact.findUnique({
                where: { id: req.params.id },
            }),
            true
        );
        if (!contact) {
            return res.status(404).send('Contact not found');
        }
        try {
            contact = new Contact(contact, true);
            contact.update(req.body);
            await contact.save();
            req.flash('info', 'Updated Contact!');
            return res.redirect('/contacts/' + contact.id);
        } catch (e) {
            req.flash('error', e.message);
            return res.render(`contacts/edit`, {
                contact: contact,
                flashes: { error: [e.message] },
            });
        }
    }
);
app.get('/contacts/:id', async (req, res) => {
    const flashes = req.session.flash;
    delete req.session.flash;
    const contact = await prisma.contact.findUnique({
        where: { id: req.params.id },
    });
    if (!contact) {
        return res.status(404).send('Contact not found');
    }
    return res.render('contacts/view', {
        contact: new Contact(contact, true),
        flashes: flashes,
    });
});
app.post(
    '/contacts/new',
    express.urlencoded({ extended: true }),
    async (req, res) => {
        const flashes = req.session.flash;
        delete req.session.flash;
        let newContact = new Contact(req.body, false); // should not throw in any case ;)
        try {
            newContact.save(); // this throws!!
            req.flash('info', 'Created New Contact!');
            return res.redirect('/contacts');
        } catch (e) {
            req.flash('error', e.message);
            return res.render('/contacts/edit', {
                contact: newContact,
                flashes: flashes,
            });
        }
    }
);
app.post('/contacts/:id/delete', async (req, res) => {
    delete req.session.flash;
    try {
        await prisma.contact.delete({
            where: { id: req.params.id },
        });
        req.flash('info', 'Deleted Contact!');
    } catch (e) {
        req.flash('error', e.message);
    }
    return res.redirect('/contacts');
});
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
