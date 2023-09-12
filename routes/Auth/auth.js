const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/auth');
const authController = require('../../controllers/Auth/authController');


router.post('/login', authController);

module.exports = router;
