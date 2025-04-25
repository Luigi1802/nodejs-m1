const express = require('express');
const equipmentController = require('../controllers/equipmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Routes pour la gestion des équipements

// POST /api/equipments : Ajouter un équipement (admin uniquement)
router.post('/', authMiddleware, roleMiddleware('admin'), equipmentController.addEquipment);
// PUT /api/equipments/:id : Modifier un équipement par son ID (admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), equipmentController.updateEquipment);
// DELETE /api/equipments/:id : Supprimer un équipement par son ID (admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), equipmentController.deleteEquipment);
// GET /api/equipments/ : Récupérer tous les équipements (admin et customer)
router.get('/', authMiddleware, equipmentController.getAllEquipment);

module.exports = router;