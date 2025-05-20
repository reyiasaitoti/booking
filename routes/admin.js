require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username, password); // 🔍 Debug

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      console.log('No user found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = results[0];
    console.log('Found user:', admin.username);

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err || !isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    });
  });
});


module.exports = router;
