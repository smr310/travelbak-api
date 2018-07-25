'use strict'
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config.js');
const { User } = require('./users/models');
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

//Routes that I need to build: 

//      post /trip                  YES --- Wired to front end (BUT STILL NEED TO ADD DATE FUNCTIONALITY, ALSO NEEDS TO GRAB USERID, AND TRIPID)
//      post /journalEntry          YES --- Wired to front end (BUT STILL NEED TO ADD DATE FUNCTIONALITY, ALSO NEEDS TO GRAB USERID)

//      get /trip                   YES (returns array of all trips) -- Partially wired to frontend   

//      put /trip                   YES
//      put /journalEntry           YES

//      delete /trip                YES -- Wired to front end -- STILL NEED TO GRAB USERID
//      delete /journalEntry        YES -- Wired to front end -- STILL NEED TO GRAB USERID


app.get('/api/trip/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            res.json(user.trips)
        })
})

app.post('/api/trip/:userId', (req, res) => {
    const newTrip = {
        title: req.body.title,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    User.findById(req.params.userId)
        .then(user => {
            user.trips.push(newTrip)

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                
                let n = user.trips.length;
                res.json(user.trips[n-1])
                //user.findbyID -- find the trip 
                //user.trip.id(...)
                //send that back the trip
                //we need the trip that they just added 
            })



        })
})

app.delete('/api/trip/:userId', (req, res) => {

    User.findById(req.params.userId)
        .then(user => {

            user.trips.id(req.body.tripId).remove()

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(user.trips)
            })
        })
})


app.put('/api/trip/:userId', (req, res) => {

    User.findById(req.params.userId)
        .then(user => {
            let trip = user.trips.id(req.body.tripId);
            trip.title = req.body.title,
            trip.location = req.body.location,
            trip.startDate = req.body.startDate,
            trip.endDate = req.body.endDate

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(user.trips.id(req.body.tripId))
            })
        })
})


//journal entry routes

app.delete('/api/journal/:userId', (req, res) => {

    User.findById(req.params.userId)
        .then(user => {
            const trip = user.trips.id(req.body.tripId);
            const journalEntry = trip.journalEntries.id(req.body.journalEntryId);
            
            journalEntry.remove();

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(trip)
            })
        })
})

app.put('/api/journal/:userId', (req, res) => {

    console.log('this is req.body', req.body)

    User.findById(req.params.userId)
        .then(user => {
            const trip = user.trips.id(req.body.journalEntry.tripId);
            console.log('this is trip:', trip)

            let journalEntry = trip.journalEntries.id(req.body.journalEntry.journalEntryId);

            journalEntry.content = req.body.journalEntry.content;
            journalEntry.date = req.body.journalEntry.date;

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(trip);
            })
        })
})


app.post('/api/journal/:userId', (req, res) => {
    const newJournalEntry = {
        content: req.body.content,
        date: req.body.date
    }

    User.findById(req.params.userId)
        .then(user => {
            const trip = user.trips.id(req.body.tripId);
            trip.journalEntries.push(newJournalEntry)

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(trip)
            })
        })
})




//how can i get get request to work with no body?
//Actually -- If I dont think I need this. If I do get request for a trip, it will have all the entries
app.get('/api/journal/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            const trip = user.trips.id(req.body.tripId)
            res.json(trip.journalEntries)
        })
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

