'use strict'
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: tripRouter } = require('./trip-router')
const { router: journalRouter } = require('./journal-router')

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
app.use('/api/trip', tripRouter);
app.use('/api/journal', journalRouter)


// CORS 
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});



let server;

function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
        console.log('this is the db URL: ', databaseUrl);
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

