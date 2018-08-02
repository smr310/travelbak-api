'use strict';

const mongoose = require('mongoose');

const journalEntrySchema = mongoose.Schema({
    title: { type: String },
    content: { type: String },
    date: { type: String }
});


const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = { JournalEntry, journalEntrySchema };
