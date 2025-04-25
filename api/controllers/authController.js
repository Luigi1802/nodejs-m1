const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Fonction pour l'authentification de l'utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Vérification du mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    // Génération du token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Fonction pour l'inscription de l'utilisateur
exports.register = async (req, res) => {
  const { email, password} = req.body;
  try {
    // Vérification de l'existence de l'utilisateur (il ne doit pas exister)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already used' });
    }

    // Création de l'utilisateur (customer par défaut)
    const newUser = new User({ email, password, role: "customer" });
    await newUser.save();

    res.status(201).json({ message: 'User successfully created' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Fonction pour la réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Création d'un token temporaire pour la réinitialisation du mot de passe
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Envoi de l'email avec le lien pour réinitialiser le mot de passe
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Envoi de l'email avec le lien du front pour réinitialiser le mot de passe (token dans l'URL)
    await sendEmail(email, 'Réinitialisation du mot de passe', `Cliquez ici pour réinitialiser votre mot de passe: ${resetLink}\nCe lien est valable 15 minutes.`);

    res.json({ message: 'Reset password email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  }
};

// Fonction pour appliquer un nouveau mot de passe
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    // Vérification de l'existence du token et du nouveau mot de passe
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
  
    try {
      // Vérification du token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: 'Invalid token or user not found' });
      }
      // Changement du mot de passe
      user.password = newPassword; 
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
};
