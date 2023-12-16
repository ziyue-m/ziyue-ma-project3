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

// @route GET api/statusUpdates/user/:username
// @desc Get status updates for a specific user
// @access Private
router.get('/user/:username', authMiddleware, statusUpdateController.getStatusUpdatesForUser);

// @route PUT api/statusUpdates/:id
// @desc Update a status update
// @access Private
router.put('/:id', authMiddleware, statusUpdateController.updateStatusUpdate);

// @route DELETE api/statusUpdates/:id
// @desc Delete a status update
// @access Private
router.delete('/:id', authMiddleware, statusUpdateController.deleteStatusUpdate);


module.exports = router;
