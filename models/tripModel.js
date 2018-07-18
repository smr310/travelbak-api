'use strict';

const mongoose = require('mongoose');
const { journalEntrySchema } = require('../models/journalEntryModel')

const tripSchema = mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    journalEntries: [journalEntrySchema]
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = { Trip, tripSchema };
