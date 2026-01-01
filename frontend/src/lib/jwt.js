import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function getTokenFromRequest(req) {
    console.log('Getting token from request...');

    // Check Authorization header
    const authHeader = req.headers.authorization || req.headers.get?.('authorization');
    console.log('Authorization header:', authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('Token found in Authorization header');
        return token;
    }

    // Check cookies
    const token = req.cookies?.token || req.cookies?.get?.('token')?.value;
    console.log('Cookie token:', token ? 'Present' : 'Missing');
    if (token) {
        console.log('Token found in cookies');
        return token;
    }

    console.log('No token found in request');
    return null;
}

// Client-side function to get token from localStorage
export function getTokenFromStorage() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
}