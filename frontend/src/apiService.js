const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/links';

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        if (response.status === 409 && data.error) {
            throw new Error(data.error);
        }
        
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
}

// --- API FUNCTIONS ---

export const fetchLinks = async () => {
    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
};


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