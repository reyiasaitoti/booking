require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = results[0];

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    });
  });
});


module.exports = router;
