
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function isValidCustomCode(code) {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Basic validation for the URL format [cite: 22]
function isValidUrl(url) {
    return url.startsWith('http://') || url.startsWith('https://');
}

module.exports = { generateRandomCode, isValidCustomCode, isValidUrl };