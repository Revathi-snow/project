const express = require('express');
const router = express.Router();
const attendanceController = require('./attendanceController');

// POST route for marking attendance
router.post('/mark', attendanceController.markAttendance);

module.exports = router;