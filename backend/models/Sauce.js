const mongoose = require('mongoose');
const regExp = require('../library/regexp');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, match: regExp.sauceForm },
    manufacturer: { type: String, required: true, match: regExp.sauceForm },
    description: { type: String, required: true, match: regExp.sauceForm },
    mainPepper: { type: String, required: true, match: regExp.sauceForm },
    imageUrl: { type: String, required: true },
    heat: { type: Number, min: 1, max: 10, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    // usersLiked: { type: [String] },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);