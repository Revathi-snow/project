const express = require('express');
const cors = require('cors');
require('dotenv').config();

const attendanceRoutes = require('./attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mounting
app.use('/api/attendance', attendanceRoutes);

// Root endpoint test check
app.get('/', (req, res) => {
  res.send('Attendance System Backend is running live.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});