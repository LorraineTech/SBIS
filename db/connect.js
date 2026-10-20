const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stock_data',
  waitForConnections: true,
  connectionLimit: 10,
});

db.getConnection()
  .then(conn => {
    console.log('Database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.log('MySQL connect error:', err.message);
  });

module.exports = db;