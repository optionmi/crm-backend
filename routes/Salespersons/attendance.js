const express = require('express');
const router = express.Router();
const { createAttendance} = require('../../controllers/Salespersons/attendanceController');
const authenticateUser = require('../../middleware/auth');


router.post('/', authenticateUser, createAttendance);

module.exports = router;