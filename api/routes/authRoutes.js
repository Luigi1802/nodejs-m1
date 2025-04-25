const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Routes d'authentification
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;