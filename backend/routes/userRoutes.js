const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', userController.register);

// @route POST api/users/login
// @desc Login User / Returning JWT Token
// @access Public
router.post('/login', userController.login);

// @route GET api/users/current
// @desc Get current user
// @access Private
router.get('/current', authMiddleware, userController.getCurrentUser);

module.exports = router;
