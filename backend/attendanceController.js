const db = require('./db');
const geolib = require('geolib'); // Or your Haversine formula helper

// 1. Mark Attendance with Geofencing & Database Insertion
exports.markAttendance = async (req, res) => {
  try {
    const { userId, locationId, latitude, longitude } = req.body;

    // Fetch the target location coordinates from your 'locations' table
    const locationQuery = 'SELECT * FROM locations WHERE id = $1';
    const locationResult = await db.query(locationQuery, [locationId]);

    if (locationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found in database.' });
    }

    const targetLocation = locationResult.rows[0];

    // Calculate distance using Haversine formula (or geolib package)
    const distance = geolib.getDistance(
      { latitude, longitude },
      { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
    );

    // Check if user is within the permitted radius (e.g., targetLocation.radius_meters)
    if (distance > targetLocation.radius_meters) {
      return res.status(400).json({ 
        error: `You are too far from the location. Distance: ${distance}m.` 
      });
    }

    // Insert attendance record matching your schema table columns
    const insertQuery = `
      INSERT INTO attendance_records (user_id, location_id, timestamp, status)
      VALUES ($1, $2, NOW(), $3)
      RETURNING *;
    `;
    const values = [userId, locationId, 'Present'];
    const newRecord = await db.query(insertQuery, values);

    res.status(201).json({
      message: 'Attendance marked successfully!',
      record: newRecord.rows[0]
    });

  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ error: 'Server error while marking attendance.' });
  }
};

// 2. Fetch All Records for the Admin Dashboard
exports.getAllAttendance = async (req, res) => {
  try {
    const query = `
      SELECT ar.id, ar.user_id, ar.timestamp, ar.status, l.name as location_name 
      FROM attendance_records ar
      LEFT JOIN locations l ON ar.location_id = l.id
      ORDER BY ar.timestamp DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    res.status(500).json({ error: 'Server error while fetching records.' });
  }
};