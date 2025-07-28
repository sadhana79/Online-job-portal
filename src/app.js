const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("../db.js"); 
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registration API
app.post('/api/register', (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be 6 characters long' });
  }
  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Check for existing email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Insert new user
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Registration failed' });

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

module.exports = app;
