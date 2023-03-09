const mongoose = require('mongoose');
const moment = require("moment");

const exerciseSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A username is required.'],
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.']
    },
    date: {
        type: Date,
        default: moment().format('YYYY MM DD'),
    }
})
module.exports = mongoose.model('Exercise', exerciseSchema);