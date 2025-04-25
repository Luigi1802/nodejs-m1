const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = new mongoose.Schema({
    email: { type: String, required: true,  match: [/\S+@\S+\.\S+/, 'Invalid email'], unique: true },
    password: { type: String, required: true },
    blocked: { type: Boolean, required: false, default: false },
    role: { type: String,  enum: ['customer', 'admin'], required: true }
});

UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
UserModel.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
  

module.exports = mongoose.model('User', UserModel);