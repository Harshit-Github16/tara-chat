// API utility functions with automatic token handling

export async function apiRequest(url, options = {}) {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    console.log('API Request to:', url, 'Token:', token ? 'Present' : 'Missing');

    // Default headers
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header if token exists
    if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
        console.log('Authorization header added');
    } else {
        console.warn('No token found for API request');
    }

    // Merge headers
    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    // Default options
    const defaultOptions = {
        credentials: 'include', // Include cookies
        headers,
    };

    // Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, finalOptions);

        // Handle 401 errors (token expired/invalid)
        if (response.status === 401) {
            // Clear invalid token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
            }
            // Don't auto-redirect, let the calling code handle it
            console.log('Authentication failed - token invalid or expired');
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Convenience methods
export const api = {
    get: (url, options = {}) => apiRequest(url, { ...options, method: 'GET' }),
    post: (url, data, options = {}) => apiRequest(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (url, data, options = {}) => apiRequest(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (url, options = {}) => apiRequest(url, { ...options, method: 'DELETE' }),
};