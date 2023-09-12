const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/auth');
const { createBook, getBookById, updateBook, getAllBooks } = require('../../controllers/Publishers/booksController');

router.post('/create', authenticateUser, createBook);
router.get('/all', authenticateUser, getAllBooks)
router.get('/:id', authenticateUser, getBookById);
router.put('/:id', authenticateUser, updateBook);

module.exports = router;