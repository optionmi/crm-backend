const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Create a new book
router.post('/books/create', bookController.createBook);

// Get all books
router.get('/books', bookController.getAllBooks);

// Get a specific book by ID
router.get('/books/:id', bookController.viewBook);

// Update a specific book by ID
router.put('/books/:id', bookController.updateBook);

// Delete a specific book by ID
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;