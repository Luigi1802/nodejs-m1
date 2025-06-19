// Vérifaction du rôle de l'utilisateur pour les requêtes réservées aux admins
module.exports = function (role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      next();
    };
  };