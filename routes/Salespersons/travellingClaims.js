const express = require('express');
const router = express.Router();
const { createClaim, getAllClaims, } = require('../../controllers/Salespersons/travellingclaimsController');
const authenticateUser = require('../../middleware/auth');

router.post('/', authenticateUser, createClaim);
router.get('/all',authenticateUser, getAllClaims);

module.exports = router;