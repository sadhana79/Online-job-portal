const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// ---------- HR MANAGEMENT ----------

// Add HR
exports.addHR = async (req, res) => {
  try {
    const { name, email, password, contact = null, education = null } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'name, email, password required' });

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Insert HR into the database
    await pool.query(
      'INSERT INTO users (name, email, contact, education, password, role) VALUES (?,?,?,?,?, "hr")',
      [name, email, contact, education, hash]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// View all HRs
exports.hrs = async (req, res) => {
  try {
    const q = `%${(req.query.q || '').toLowerCase()}%`;
    const [rows] = await pool.query(
      'SELECT id, name, email, contact, education, role FROM users WHERE role="hr" AND LOWER(name) LIKE ? ORDER BY created_at DESC',
      [q]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get HR by ID
exports.getHR = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, contact, education, role FROM users WHERE id=? AND role="hr"',
      [req.params.id]
    );
    const hr = rows[0];
    if (!hr) return res.status(404).json({ msg: 'Not found' });
    res.json(hr);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update HR
exports.updateHR = async (req, res) => {
  try {
    const { name, email, contact = null, education = null, password } = req.body;

    let query;
    const params = [name, email, contact, education, req.params.id];

    if (password && password.trim().length) {
      const hash = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET name=?, email=?, contact=?, education=?, password=? WHERE id=? AND role="hr"';
      params.push(hash); // Add password to the query parameters
    } else {
      query = 'UPDATE users SET name=?, email=?, contact=?, education=? WHERE id=? AND role="hr"';
    }

    await pool.query(query, params);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete HR
exports.removeHR = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=? AND role="hr"', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------- USERS MANAGEMENT ----------

// Add User
exports.addUser = async (req, res) => {
  try {
    const { name, email, contact, skills, experience, education, college, password } = req.body;

    // Validate input
    if (!name || !email || !contact || !skills || !experience || !education || !college || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if the user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      'INSERT INTO users (name, email, contact, skills, experience, education, college, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "user")',
      [name, email, contact, skills, experience, education, college, hashedPassword]
    );

    // Send response
    res.status(201).json({ msg: 'User added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// View all Users
exports.users = async (req, res) => {
  try {
    const q = `%${(req.query.q || '').toLowerCase()}%`;  // Search query (if any)

    // Query to fetch all user fields
    const [rows] = await pool.query(
      'SELECT id, name, email, contact, skills, experience, education, college, role FROM users WHERE role="user" AND LOWER(name) LIKE ? ORDER BY created_at DESC',
      [q]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, contact, skills, experience, education, college, role FROM users WHERE id=? AND role="user"',
      [req.params.id]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ msg: 'Not found' });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, contact, skills, experience, education, college, password } = req.body;

    // Validate input
    if (!name || !email || !contact || !skills || !experience || !education || !college) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // If password is provided, hash it
    let hashedPassword = null;
    if (password && password.trim().length) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateFields = [name, email, contact, skills, experience, education, college, req.params.id];
    const queryParams = hashedPassword
      ? [...updateFields, hashedPassword] // Include password if it's provided
      : updateFields;

    const query = hashedPassword
      ? 'UPDATE users SET name=?, email=?, contact=?, skills=?, experience=?, education=?, college=?, password=? WHERE id=? AND role="user"'
      : 'UPDATE users SET name=?, email=?, contact=?, skills=?, experience=?, education=?, college=? WHERE id=? AND role="user"';

    await pool.query(query, queryParams);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete User
exports.removeUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=? AND role="user"', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ---------- STATS MANAGEMENT ----------

// Get Stats (jobs, applications, users, hrs count)
exports.stats = async (req, res) => {
  try {
    const [[j]] = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const [[a]] = await pool.query('SELECT COUNT(*) as count FROM applications');
    const [[u]] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role="user"');
    const [[h]] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role="hr"');
    res.json({ jobs: j.count, applications: a.count, users: u.count, hrs: h.count });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};
