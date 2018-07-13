'use strict';

const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    journalEntries: { type: Array, required: true }
});


const Trip = mongoose.model('Trip', tripSchema);

module.exports = { Trip };
