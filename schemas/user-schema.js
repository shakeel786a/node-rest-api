const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // first_name: {
    //     type: String,
    //     required: true
    // },
    // last_name: {
    //     type: String,
    //     required: true
    // },
    // gender: {
    //     type: String,
    //     required: true
    // },
    // father_name: {
    //     type: String,
    //     required: false
    // },
    first_name: String,
    last_name: String,
    gender: String,
    father_name: String
});

module.exports = mongoose.model('users', userSchema);