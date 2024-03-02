'use strict';
const express = require('express');
// Create the express app
const app = express();

// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)
// Error handlers
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', req.query);
});
app.get('/contacts', (req, res) => {
    res.render('contacts', { name: 'John' });
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
