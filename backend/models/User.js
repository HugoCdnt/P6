const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const regExp = require('../middleware/regexp');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, match: regExp.email },
    password: { type: String, required: true, match: regExp.password }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// password: { type: String, required: true }