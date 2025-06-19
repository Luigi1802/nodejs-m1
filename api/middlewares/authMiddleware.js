const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
module.exports = function (req, res, next) {
  // Vérifie si le token est présent dans l'en-tête Authorization de la requête
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied. Missing token' });
  // Vérifie si le token est valide
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};