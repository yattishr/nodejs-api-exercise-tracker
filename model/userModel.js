const mongoose = require('mongoose');
const moment = require("moment");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'A username is required.'], 
        unique: true,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    passwordconfirm: {
        type: String,
        required: false,
    },
    createdate: {
        type: Date,
        default: moment().format('YYYY MM DD'),
    }
})
module.exports = mongoose.model('User', userSchema)