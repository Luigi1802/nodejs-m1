const express = require('express');
const customerRequestController = require('../controllers/customerRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

// create a new customer request
router.post('/', authMiddleware, customerRequestController.createRequest);

// get all customer requests
router.get('/', authMiddleware, customerRequestController.getRequests);

// get all customer requests
router.get('/my-requests', authMiddleware, customerRequestController.getCustomerRequests);

// get a customer request by id
router.put('/:id', authMiddleware, roleMiddleware('admin'), customerRequestController.updateRequest);

module.exports = router;