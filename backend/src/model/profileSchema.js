const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    headline: {
        type: String,
        required: [false],
        default: "default headline"
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    zipcode: {
        type: Number,
        required: [true, 'Zipcode is required']
    },
    dob: {
        type: Date,
        required: [true, 'DoB is required']
    },
    avatar: {
        type: String,
        required: [false],
        default: "https://on3static.com/teams/rice-owls.svg"
    },
    followedUsers: {
        type: Array,
        required: [false]
    }
});

module.exports = profileSchema;