const express = require('express');
const router = express.Router();
const statusUpdateController = require('../controllers/statusUpdateController');
const authMiddleware = require('../middleware/authMiddleware');

// @route POST api/statusUpdates
// @desc Create a status update
// @access Private
router.post('/', authMiddleware, statusUpdateController.createStatusUpdate);

// @route GET api/statusUpdates
// @desc Get all status updates
// @access Public
router.get('/', statusUpdateController.getAllStatusUpdates);

module.exports = router;
