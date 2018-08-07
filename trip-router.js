'use strict';
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const router = express.Router()
const jwtAuth = passport.authenticate('jwt', { session: false })
const { User } = require('./users/models');

router.use(jwtAuth)
router.use(bodyParser.json())


router.get('/:userId', jwtAuth, (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            res.json(user.trips)
        });
})


router.post('/:userId', jwtAuth, (req, res) => {
    const newTrip = {
        title: req.body.title,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    User.findById(req.params.userId)
        .then(user => {
            // console.log('this is user', user)
            user.trips.push(newTrip)

            user.save(err => {
                if (err) {
                    res.send(err)
                }

                let n = user.trips.length;
                res.json(user.trips[n - 1])
                //user.findbyID -- find the trip 
                //user.trip.id(...)
                //send that back the trip
                //we need the trip that they just added 
            })
        })
})

router.delete('/:userId', jwtAuth, (req, res) => {

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


router.put('/:userId', jwtAuth, (req, res) => {

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



module.exports = {router}