const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    email: { type: String, required: true,  match: [/\S+@\S+\.\S+/, 'Invalid email'], unique: true },
    password: { type: String, required: true },
    blocked: { type: Boolean, required: false, default: false },
    role: { type: String,  enum: ['customer', 'admin'], required: true }
});

module.exports = mongoose.model('User', UserModel);