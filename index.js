'use strict';
const express = require('express');
// Create the express app
const app = express();
const fs = require('fs');
const contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
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
    let data;
    if (req.query.q) {
        const q = req.query.q.toLowerCase();
        data = contacts.filter(
            (c) =>
                c.first.toLowerCase().includes(req.query.q) ||
                c.last.toLowerCase().includes(req.query.q) ||
                c.email.includes(req.query.q)
        );
    } else {
        data = contacts;
    }
    res.render('contacts', { contacts: data });
});
app.use('/', express.static('static'));
// use the "static" folder for static files
app.use(function fourOhFourHandler(req, res) {
    res.status(404).send();
});
app.use(function fiveHundredHandler(err, req, res, next) {
    console.error(err);
    res.status(500).send();
});
// Start server
app.listen(1234, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Started at http://localhost:1234');
});
