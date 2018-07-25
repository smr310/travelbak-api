'use strict';

const mongoose = require('mongoose');
const { journalEntrySchema } = require('../models/journalEntryModel')

const tripSchema = mongoose.Schema({
    title: { type: String },
    location: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    journalEntries: [journalEntrySchema]
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = { Trip, tripSchema };
