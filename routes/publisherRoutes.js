const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisherController');

// Create a new publisher
router.post('/publishers/create', publisherController.createPublisher);

// Get all publishers
router.get('/publishers', publisherController.getAllPublishers);

// Get a specific publisher by ID
router.get('/publishers/:id', publisherController.viewPublisher);

// Update a specific publisher by ID
router.put('/publishers/:id', publisherController.updatePublisher);

// Delete a specific publisher by ID
router.delete('/publishers/:id', publisherController.deletePublisher);

module.exports = router;