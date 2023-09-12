const express = require('express');
const router = express.Router();
const { createSalesperson, getSalespersonById, getAllSalespersons, updateSalesperson } = require('../../controllers/Salespersons/salespersonController');
const authenticateUser = require('../../middleware/auth');

router.post('/', authenticateUser, createSalesperson);
router.get('/salespersons/:id', authenticateUser, getSalespersonById);
router.get('/salespersons', authenticateUser, getAllSalespersons);
router.put('/salespersons/:id', authenticateUser, updateSalesperson);

module.exports = router;
