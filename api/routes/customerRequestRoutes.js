const express = require('express');
const customerRequestController = require('../controllers/customerRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// Routes pour la gestion des demandes de matériel (réservations et retours)

// POST /api/customer-requests : Ajouter une demande (customer uniquement)
router.post('/', authMiddleware, customerRequestController.createRequest);
// GET /api/customer-requests : Voir toutes les demandes (admin uniquement)
router.get('/', authMiddleware, roleMiddleware('admin'), customerRequestController.getRequests);
// GET /api/customer-requests/my-requests : Voir toutes les demandes pour un customer (customer uniquement)
router.get('/my-requests', authMiddleware, customerRequestController.getCustomerRequests);
// PUT /api/customer-requests/:id : Modifier une demande (accepter/refuser, admin uniquement)
router.put('/:id', authMiddleware, roleMiddleware('admin'), customerRequestController.updateRequest);

module.exports = router;