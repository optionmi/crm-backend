const express = require('express');
const router = express.Router();
const salespersonController = require('../controllers/salespersonController');

// Create a new salesperson
router.post('/salespersons/create', salespersonController.createSalesperson);

// Get all salespersons
router.get('/salespersons', salespersonController.getAllSalespersons);

// Get a specific salesperson by ID
router.get('/salespersons/:id', salespersonController.viewSalesperson);

// Update a specific salesperson by ID
router.put('/salespersons/:id', salespersonController.updateSalesperson);

// Delete a specific salesperson by ID
router.delete('/salespersons/:id', salespersonController.deleteSalesperson);

module.exports = router;
