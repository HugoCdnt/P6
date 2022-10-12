const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const regExp = require('../library/regexp');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, match: regExp.email },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// password: { type: String, required: true }