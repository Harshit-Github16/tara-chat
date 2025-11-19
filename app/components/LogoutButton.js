"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

export default function LogoutButton({ className = "", showIcon = true, children }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOutUser();
            router.replace('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
        >
            {showIcon && (
                <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
            )}
            {children || (loading ? 'Signing out...' : 'Sign Out')}
        </button>
    );
}