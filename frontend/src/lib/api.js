// Legacy API_BASE_URL for backward compatibility
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Service-specific base URLs
const SERVICE_URLS = {
    identity: process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:3002',
    wellness: process.env.NEXT_PUBLIC_WELLNESS_URL || 'http://localhost:3003',
    ai: process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:3001',
    content: process.env.NEXT_PUBLIC_CONTENT_URL || 'http://localhost:3004'
};

// Map route prefixes to services
const ROUTE_TO_SERVICE = {
    '/api/auth': 'identity',
    '/api/user': 'identity',
    '/api/onboarding': 'identity',
    '/api/admin/users': 'identity',
    '/api/wellness': 'wellness',
    '/api/mood': 'wellness',
    '/api/journal': 'wellness',
    '/api/user-data': 'wellness',
    '/api/goals': 'wellness',
    '/api/insights': 'wellness',
    '/api/dass21': 'wellness',
    '/api/quiz/results': 'wellness',
    '/api/stress-check': 'wellness',
    '/api/emotional-wheel': 'wellness',
    '/api/reflection-radar': 'wellness',
    '/api/insights/stats': 'wellness',
    '/api/wellness/insights/stats': 'wellness',
    '/api/ai': 'ai',
    '/api/tara-chat': 'ai',
    '/api/quiz/generate': 'ai',
    '/api/pattern-analysis': 'ai',
    '/api/suggestions': 'ai',
    '/api/mood-triggers': 'ai',
    '/api/journal-generate': 'ai',
    '/api/blog': 'content',
    '/api/contact': 'content',
    '/api/imagekit-auth': 'content',
    '/api/admin/blogs': 'content'
};

export async function apiRequest(url, options = {}) {
    let finalUrl = url;

    if (url.startsWith('/api/')) {
        // Find matching service based on prefix
        const serviceKey = Object.keys(ROUTE_TO_SERVICE).find(prefix => url.startsWith(prefix));
        const service = serviceKey ? ROUTE_TO_SERVICE[serviceKey] : null;

        if (service) {
            const baseUrl = SERVICE_URLS[service];
            // If the route is e.g. /api/ai/quiz/generate, and we call it as /api/quiz/generate in frontend
            // we need to make sure the target backend route matches.
            // Some backend routes have prefixes like /api/ai or /api/wellness.

            // For now, assume the frontend calls the "Gateway" style path and we map to backend style.
            let path = url;

            // Adjust paths if backend expects a different prefix than what frontend uses
            if (service === 'ai' && !url.startsWith('/api/ai')) path = url.replace('/api/', '/api/ai/');
            if (service === 'wellness' && !url.startsWith('/api/wellness')) path = url.replace('/api/', '/api/wellness/');

            finalUrl = `${baseUrl}${path}`;
        } else {
            // Fallback to a default (maybe Gateway if still present, or identity)
            finalUrl = `${SERVICE_URLS.identity}${url}`;
        }
    }

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    console.log('API Request to:', finalUrl, 'Token:', token ? 'Present' : 'Missing');

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
        const response = await fetch(finalUrl, finalOptions);

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
    patch: (url, data, options = {}) => apiRequest(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    delete: (url, options = {}) => apiRequest(url, { ...options, method: 'DELETE' }),
};