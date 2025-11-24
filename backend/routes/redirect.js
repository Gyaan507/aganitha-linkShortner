const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const result = await db.query('SELECT * FROM links WHERE short_code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).send('404 Not Found: The link does not exist or has been deleted.');
        }

        const link = result.rows[0];

       
        await db.query(
            'UPDATE links SET total_clicks = total_clicks + 1, last_clicked_at = NOW() WHERE id = $1',
            [link.id]
        );

        res.redirect(302, link.target_url);

    } catch (error) {
        console.error('Redirection error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;