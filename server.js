require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const db = require('./db');
const tentRoutes = require('./routes/tents');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');



const app = express();
const PORT = 5000;

// Serve static files (like images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Tent Routes
app.use('/api/tents',  tentRoutes);  // Using upload middleware for image handling
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes); 





// Bookings route
app.get('/api/bookings', (req, res) => {
  db.query('SELECT * FROM bookings', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error while fetching bookings' });
    res.json(results);
  });
});



// Serve Admin Page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));  // Serving the admin page
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
