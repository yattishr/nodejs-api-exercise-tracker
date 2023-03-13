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
    }
})
module.exports = mongoose.model('User', userSchema)