const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');


exports.addHR = async (req, res) => {
  try {
    const { name, email, password, contact = null, education = null } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'name, email, password required' });


    const hash = await bcrypt.hash(password, 10);

    
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


exports.updateHR = async (req, res) => {
  try {
    const { name, email, contact = null, education = null, password } = req.body;

    let query;
    const params = [name, email, contact, education, req.params.id];

    if (password && password.trim().length) {
      const hash = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET name=?, email=?, contact=?, education=?, password=? WHERE id=? AND role="hr"';
      params.push(hash); 
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


exports.removeHR = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=? AND role="hr"', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};



exports.addUser = async (req, res) => {
  try {
    const { name, email, contact, skills, experience, education, college, password } = req.body;


    if (!name || !email || !contact || !skills || !experience || !education || !college || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await pool.query(
      'INSERT INTO users (name, email, contact, skills, experience, education, college, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "user")',
      [name, email, contact, skills, experience, education, college, hashedPassword]
    );

    
    res.status(201).json({ msg: 'User added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.users = async (req, res) => {
  try {
    const q = `%${(req.query.q || '').toLowerCase()}%`;  

    
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


exports.updateUser = async (req, res) => {
  try {
    const { name, email, contact, skills, experience, education, college, password } = req.body;

    if (!name || !email || !contact || !skills || !experience || !education || !college) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    
    let hashedPassword = null;
    if (password && password.trim().length) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateFields = [name, email, contact, skills, experience, education, college, req.params.id];
    const queryParams = hashedPassword
      ? [...updateFields, hashedPassword] 
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

exports.removeUser = async (req, res) => {
  const id = req.params.id;
  try {

    await pool.query('DELETE FROM applications WHERE user_id = ?', [id]);

    
    await pool.query('DELETE FROM interviews WHERE user_id = ?', [id]);

  
    await pool.query('DELETE FROM users WHERE id=? AND role="user"', [id]);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.allApplications = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.created_at, a.status, a.name as applicant_name, a.education, a.college, a.experience, a.skills,
             u.id as user_id, u.email as user_email, j.id as job_id, j.title as job_title, j.category, j.location
      FROM applications a
      JOIN users u ON u.id = a.user_id
      JOIN jobs j ON j.id = a.job_id
      ORDER BY a.created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};

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
