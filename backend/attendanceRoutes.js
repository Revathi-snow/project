const express = require('express');
const router = express.Router();
const db = require('./db');
const attendanceController = require('./attendanceController');

// GET all attendance records for the admin dashboard
router.get('/', attendanceController.getAttendance);

// POST route for marking attendance
router.post('/mark', attendanceController.markAttendance);

// GET all attendance records for the admin dashboard
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT a.attendance_id, a.student_id, u.name as student_name, a.attendance_date, a.check_in_time, a.status 
      FROM attendance a
      JOIN users u ON a.student_id = u.user_id
      ORDER BY a.check_in_time DESC;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;