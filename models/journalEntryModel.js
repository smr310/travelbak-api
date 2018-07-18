'use strict';

const mongoose = require('mongoose');

const journalEntrySchema = mongoose.Schema({
    content: { type: String },
    date: { type: String }
});


const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = { JournalEntry, journalEntrySchema };
