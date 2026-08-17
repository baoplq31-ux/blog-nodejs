const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);
