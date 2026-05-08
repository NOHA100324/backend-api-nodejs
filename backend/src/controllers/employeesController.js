const pool = require('../db');

exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  // In this new system, employees register themselves via the auth route.
  // This endpoint could be used by admin to manually add a user.
  res.status(405).json({ message: 'Use /api/auth/register instead' });
};
