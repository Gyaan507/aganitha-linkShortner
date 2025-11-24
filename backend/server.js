// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


app.use('/', require('./routes/redirect')); 


app.get('/', (req, res) => {
    res.send('TinyLink Backend is running. Access the dashboard at /'); 
});

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});