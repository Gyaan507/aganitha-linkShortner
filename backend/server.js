// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// --- ROUTES ---

// 1. Health Check Endpoint [cite: 65]
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

// 2. Placeholder API Routes (We will add these next)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 3. Placeholder Redirect Route (We will add this later)
// Must be the LAST route to catch all other paths like /:code [cite: 64]
app.use('/', require('./routes/redirect')); 


// Basic server test route
app.get('/', (req, res) => {
    // In a production Next/Express app, this would serve your frontend dashboard [cite: 62]
    res.send('TinyLink Backend is running. Access the dashboard at /'); 
});

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});