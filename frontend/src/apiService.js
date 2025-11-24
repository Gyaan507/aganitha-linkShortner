// frontend/src/apiService.js
const API_BASE_URL = 'http://localhost:5000/api/links';

// Utility to handle JSON response and error codes (409)
async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        // Handle specific errors like 409 Conflict (duplicate code)
        if (response.status === 409 && data.error) {
            throw new Error(data.error);
        }
        // Handle general error messages
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
}

// --- API FUNCTIONS ---

/**
 * Fetches all existing short links.
 * GET /api/links
 */
export const fetchLinks = async () => {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
};

/**
 * Creates a new short link.
 * POST /api/links
 */
export const createLink = async (targetUrl, customCode = '') => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            targetUrl, 
            customCode: customCode || undefined 
        }),
    });
    return handleResponse(response);
};

/**
 * Deletes a link by its short code.
 * DELETE /api/links/:code
 */
export const deleteLink = async (code) => {
    const response = await fetch(`${API_BASE_URL}/${code}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Link not found');
        }
        throw new Error(`Deletion failed with status ${response.status}`);
    }
    return true; 
};