const express = require('express');
const router = express.Router();
const authenticateUser = require('../../middleware/auth');
const { createPublisher, getPublisherData, updatePublisherData, getAllPublishers } = require('../../controllers/Publishers/publisherController');


router.post('/', authenticateUser, createPublisher);
router.get('/info', authenticateUser, getPublisherData);
router.get('/all', authenticateUser, getAllPublishers);
router.put('/:publisherId', authenticateUser, updatePublisherData);

module.exports = router;
