const mongoose = require('mongoose');
const moment = require("moment");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A username is required.'], 
        unique: true,
    },
    createdate: {
        type: Date,
        default: moment().format('YYYY MM DD'),
    },
    exercises: [
        {
            description: {
                type: String,
                required: [true, 'A description is required.'],
            },
            duration: {
                type: Number,
                required: [true, 'A duration is required.'],
            },
            date: {
                type: String,
                default: Date.now,
            }
        }
    ]
})

module.exports = mongoose.model('User', userSchema)