const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const articleSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true]
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    date: {
        type: Date,
        required: [false],
        default: new Date()
    },
    comments: {
        type: Array,
        required: [false]
    },
    image: {
        type: String,
        required: [false]
    }
})

articleSchema.plugin(AutoIncrement, {id:'article_seq', inc_field:'pid'});
module.exports = articleSchema;