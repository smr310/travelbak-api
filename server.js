'use strict'
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const { PORT, DATABASE_URL } = require('./config');
const { Trip } = require('./models');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/api/*', (req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };


app.post('/trips', (req, res) => {
    console.log('this is req.body', req.body)
    Trip
        .create({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            journalEntries: req.body.journalEntries
        })
        .then(trip => res.status(201).json(trip))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


let server;

function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}


if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };
