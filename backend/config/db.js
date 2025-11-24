// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a new Pool instance using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection when the module loads
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client from pool:', err.stack);
  } else {
    console.log('Successfully connected to the database!');
    release(); // Release the client back to the pool
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool, // Export the pool for direct use if needed
};