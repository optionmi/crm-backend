const express = require('express');
const router = express.Router();
const { createAttendance, getAttendance} = require('../../controllers/Salespersons/attendanceController');
const authenticateUser = require('../../middleware/auth');


router.post('/', authenticateUser, createAttendance);
router.get('/salespersons/:id', authenticateUser, getAttendance);

module.exports = router;