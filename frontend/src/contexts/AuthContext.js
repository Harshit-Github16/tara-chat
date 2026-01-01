"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '../lib/firebase';
import { api, API_BASE_URL } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        try {
            // Check if token exists first
            const token = localStorage.getItem('authToken');
            console.log('AuthContext checkAuth - token exists:', !!token);

            if (!token) {
                console.log('No token found, setting user to null');
                setUser(null);
                setLoading(false);
                return;
            }

            console.log('Fetching user data from API...');
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User data fetched:', data.user);
                setUser(data.user);
            } else {
                // Invalid token
                console.log('Invalid token, removing from storage');
                localStorage.removeItem('authToken');
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return { success: true, user: data.user };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            // Import Firebase signOut function
            const { signOutUser } = await import('../lib/firebase');
            await signOutUser();

            // Clear localStorage token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
            }

            // Also clear our JWT cookie
            await api.post('/api/auth/logout', {});

            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData) => {
        try {
            const response = await api.post('/api/auth/me', userData);

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return { success: true, user: data.user };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};