const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage }); // ✅ THIS DEFINES upload


// Get all tents
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tents';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' }); // Use "return" to stop further execution
    }

    const formattedTents = results.map(tent => ({
      ...tent,
      image: tent.image.replace(/\\/g, '/'),
    }));

    res.json(formattedTents); // This sends the response once
  });
});

// Add a new tent
router.post('/', upload.single('image'), (req, res) => {
  const { title, description, price } = req.body;
  const image = req.file ? req.file.path : null;

  const query = 'INSERT INTO tents (title, description, price, image) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, price, image], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add new tent' });
    }
    res.json({ message: 'Tent added successfully', tent: { title, description, price, image } });
  });
});



// Delete a tent by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tents WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete tent' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tent not found' });
    res.json({ message: 'Tent deleted successfully' });
  });
});


module.exports = router;
