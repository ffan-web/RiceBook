const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String
});

module.exports = userSchema;
