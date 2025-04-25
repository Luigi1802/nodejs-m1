const express = require('express');
const equipmentController = require('../controllers/equipmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), equipmentController.addEquipment);
router.put('/:id', authMiddleware, roleMiddleware('admin'), equipmentController.updateEquipment);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), equipmentController.deleteEquipment);
router.get('/', authMiddleware, equipmentController.getAllEquipment);

module.exports = router;