const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma des utilisateurs (admin et customer)
const UserModel = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true,  match: [/\S+@\S+\.\S+/, 'Invalid email'], unique: true },
    password: { type: String, required: true },
    blocked: { type: Boolean, required: false, default: false },
    role: { type: String,  enum: ['customer', 'admin'], required: true }
});

// Le mot de passe est haché avant d'être enregistré dans la base de données
UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
// Méthode pour comparer le mot de passe fourni par l'utilisateur avec le mot de passe haché dans la base de données
UserModel.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
  

module.exports = mongoose.model('User', UserModel);