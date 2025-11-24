// utils/codeGenerator.js

/**
 * Generates a random alphanumeric string (A-Z, a-z, 0-9) 
 * with a length between 6 and 8 characters, as required by the rules. 
 * @returns {string} The generated short code.
 */
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // Randomly choose a length between 6 and 8 (inclusive)
    const length = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Basic validation function for the custom code format 
function isValidCustomCode(code) {
    // Regex for [A-Za-z0-9]{6,8}
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Basic validation for the URL format [cite: 22]
function isValidUrl(url) {
    // A robust URL validation regex is complex, this is a simple check.
    // Ensure it starts with http:// or https://
    return url.startsWith('http://') || url.startsWith('https://');
}

module.exports = { generateRandomCode, isValidCustomCode, isValidUrl };