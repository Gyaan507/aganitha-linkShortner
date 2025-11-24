const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /:code - Redirect to original URL
router.get('/:code', async (req, res) => {
    const { code } = req.params;

    try {
        // 1. Look up the link by short_code
        const result = await db.query('SELECT * FROM links WHERE short_code = $1', [code]);

        // 2. If not found, return 404 (as per rules)
        if (result.rows.length === 0) {
            return res.status(404).send('404 Not Found: The link does not exist or has been deleted.');
        }

        const link = result.rows[0];

        // 3. Increment click count and update timestamp (Async "Fire and Forget" optional, but we await for safety)
        // We don't need to wait for this to finish to redirect, but it ensures data integrity.
        await db.query(
            'UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE id = $1',
            [link.id]
        );

        // 4. Perform HTTP 302 Redirect
        res.redirect(302, link.target_url);

    } catch (error) {
        console.error('Redirection error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;