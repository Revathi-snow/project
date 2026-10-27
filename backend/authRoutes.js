const express = require('express');
const router = express.Router();
const authController = require('./authController');

// POST route for login
router.post('/login', authController.loginUser);

module.exports = router;