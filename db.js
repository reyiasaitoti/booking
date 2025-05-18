const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Change if using different MySQL user
  password: '',  // Add password if needed
  database: 'maragreencamp'  // Database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});

module.exports = db;
