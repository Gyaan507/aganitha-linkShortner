const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const QRCode = require('qrcode'); 
const { generateRandomCode, isValidCustomCode, isValidUrl } = require('../utils/codeGenerator');

// --- GET /api/links - List all links ---
router.get('/links', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM links ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ error: 'Server error fetching links' });
    }
});

// --- POST /api/links - Create link (409 if code exists) ---
router.post('/links', async (req, res) => {
    let { targetUrl, customCode } = req.body; 

    if (!targetUrl || typeof targetUrl !== 'string' || !isValidUrl(targetUrl)) {
        return res.status(400).json({ error: 'Invalid URL format. Must start with http:// or https://.' });
    }

    let shortCode = customCode;
    
    if (shortCode) {
        if (!isValidCustomCode(shortCode)) {
            return res.status(400).json({ 
                error: 'Invalid custom code format. Must be 6-8 alphanumeric characters.' 
            });
        }
    } else {
        shortCode = generateRandomCode(); 
    }

    const queryText = `
        INSERT INTO links (short_code, target_url) 
        VALUES ($1, $2)
        RETURNING *;
    `;
    
    try {
        const result = await db.query(queryText, [shortCode, targetUrl]);
        res.status(201).json({ 
            message: 'Link created successfully!',
            shortLink: `${process.env.BASE_URL}/${shortCode}`,
            link: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ 
                error: 'Conflict: Custom code already exists. Please choose a different one.'
            });
        }
        console.error('Database insertion error:', error);
        res.status(500).json({ error: 'An unexpected server error occurred.' });
    }
});

// --- GET /api/links/:code - Stats for one code ---
router.get('/links/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const result = await db.query('SELECT * FROM links WHERE short_code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching link stats:', error);
        res.status(500).json({ error: 'Server error fetching link stats' });
    }
});

// --- DELETE /api/links/:code - Delete link ---
router.delete('/links/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const result = await db.query('DELETE FROM links WHERE short_code = $1 RETURNING *', [code]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ error: 'Server error deleting link' });
    }
});

// --- NEW: QR Code Generator Endpoint ---
router.get('/qr', async (req, res) => {
    const { url } = req.query;

    // 1. Basic Validation
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // 2. Set Header to Image
        res.setHeader('Content-Type', 'image/png');
        
        // 3. Generate QR Code directly to the response stream
        await QRCode.toFileStream(res, url, {
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#1f2a41', 
                light: '#ffffff' 
            }
        });
        
    } catch (error) {
        console.error('QR Generation Error:', error);
        res.status(500).send('Failed to generate QR code');
    }
});

module.exports = router;