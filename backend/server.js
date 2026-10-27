const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, contact, course, enrollment_date, duration } = req.body;

  try {
    const updateQuery = `
      UPDATE student_details 
      SET first_name = $1, last_name = $2, contact = $3, course = $4, enrollment_date = $5, duration = $6
      WHERE student_id = $7
      RETURNING *;
    `;
    
    const values = [first_name, last_name, contact, course, enrollment_date, duration, id];
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Profile updated successfully', student: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const path = require('path');

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../frontend/frontend/public')));
db.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL connected successfully!'))
  .catch(err => console.error('Database connection failed:', err.message));
// Routes Mounting
const attendanceRoutes = require('./attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);
const authRoutes = require('./authRoutes');
app.use('/api/auth', authRoutes);
// Root endpoint test check
app.get('/', (req, res) => {
  res.send('Attendance System Backend is running live.');
});
// Get student details by ID for the profile form
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM student_details WHERE student_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
 // Student Attendance API endpoint matching your exact PostgreSQL schema
app.get('/api/student/attendance/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // 1. Get student name from the 'users' table
    const userResult = await db.query(
      `SELECT name FROM users WHERE user_id = $1`,
      [studentId]
    );
    const studentName = userResult.rows.length > 0 ? userResult.rows[0].name : `Student (${studentId})`;

    // 2. Get attendance records using your actual column name: attendance_date
    const recordsResult = await db.query(
      `SELECT TO_CHAR(attendance_date, 'YYYY-MM-DD') as date, status 
       FROM attendance 
       WHERE student_id = $1 
       ORDER BY attendance_date DESC`,
      [studentId]
    );

    const records = recordsResult.rows;

    // 3. Calculate summary statistics
    const totalClasses = records.length;
    const presentDays = records.filter(r => r.status && r.status.toLowerCase() === 'present').length;
    const absentDays = records.filter(r => r.status && r.status.toLowerCase() === 'absent').length;
    const attendanceRate = totalClasses > 0 ? ((presentDays / totalClasses) * 100).toFixed(1) : 0;

    // 4. Send response to frontend (adding a default subject label since column doesn't exist)
    res.json({
      studentName: studentName,
      summary: {
        totalClasses: totalClasses,
        presentDays: presentDays,
        absentDays: absentDays,
        attendanceRate: attendanceRate
      },
      records: records.map(r => ({
        date: r.date,
        subject: 'General Session', 
        status: r.status
      }))
    });

  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Failed to fetch student attendance from database' });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});