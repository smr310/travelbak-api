'use strict';
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const router = express.Router()
const jwtAuth = passport.authenticate('jwt', { session: false })
const { User } = require('./users/models');

router.use(jwtAuth)
router.use(bodyParser.json())


router.delete('/:userId', jwtAuth, (req, res) => {

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

router.put('/:userId', jwtAuth, (req, res) => {

    User.findById(req.params.userId)
        .then(user => {
            const trip = user.trips.id(req.body.journalEntry.tripId);
            console.log('this is trip:', trip)

            let journalEntry = trip.journalEntries.id(req.body.journalEntry.journalEntryId);

            journalEntry.content = req.body.journalEntry.content;
            journalEntry.date = req.body.journalEntry.date;
            journalEntry.title = req.body.journalEntry.title;

            user.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json(trip);
            })
        })
})

router.post('/:userId', jwtAuth, (req, res) => {
    const newJournalEntry = {
        title: req.body.title,
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


module.exports = { router }