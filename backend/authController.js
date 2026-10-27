const db = require('./db');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found with this email' });
    }

    const user = result.rows[0];

    // Check if the password matches the database record
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Success response
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};