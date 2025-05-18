const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, email, phone, tent_id, check_in, check_out } = req.body;
  if (!name || !email || !phone || !tent_id || !check_in || !check_out) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const sql = 'INSERT INTO bookings (name, email, phone, tent_id, check_in, check_out) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, email, phone, tent_id, check_in, check_out];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Booking saved!' });
  });
});

// Get all bookings with tent titles
router.get('/', (req, res) => {
  const sql = `
    SELECT bookings.id, bookings.name, bookings.email, bookings.phone,
           tents.title AS tent_title,
           bookings.check_in, bookings.check_out
    FROM bookings
    JOIN tents ON bookings.tent_id = tents.id
    ORDER BY bookings.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    res.json(results);
  });
});


// DELETE a booking by ID
router.delete('/:id', (req, res) => {
  const bookingId = req.params.id;

  const sql = 'DELETE FROM bookings WHERE id = ?';
  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  });
});

module.exports = router;
