const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/auth');
const { createPublisher, getPublisherData, getAllPublishers } = require('../../controllers/Publishers/publisherController');


router.post('/', authenticateUser, createPublisher);
router.get('/info', authenticateUser, getPublisherData);
router.get('/all', authenticateUser, getAllPublishers);

module.exports = router;
