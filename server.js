'use strict'
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config.js');
// const { Trip } = require('./models');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/test/*', (req, res) => {
    res.json({ ok: true });
});


passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });


app.post('/trips', (req, res) => {
    console.log('this is req.body', req.body)
    Trip
        .create({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            journalEntries: req.body.journalEntries
        })
        .then(
            trip => res.status(200).json(trip))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


app.get('/trips', (req, res) => {
    Trip
        .find()
        .then(trips => res.json(trips))
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: 'Something went wrong' })
        }
        );
})





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
