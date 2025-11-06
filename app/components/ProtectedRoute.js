"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireOnboarding = true }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    // Reset hasRedirected when user data changes
    useEffect(() => {
        setHasRedirected(false);
    }, [user?.isOnboardingComplete]);

    useEffect(() => {
        if (!loading && !hasRedirected && typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            console.log('ProtectedRoute check:', {
                currentPath,
                user: !!user,
                isOnboardingComplete: user?.isOnboardingComplete,
                requireOnboarding,
                hasRedirected
            });

            if (!user) {
                // Not authenticated
                if (currentPath !== '/login') {
                    console.log('Redirecting to login - not authenticated');
                    setHasRedirected(true);
                    router.replace('/login');
                }
                return;
            }

            // User is authenticated
            if (requireOnboarding) {
                // This page requires completed onboarding
                if (!user.isOnboardingComplete) {
                    if (currentPath !== '/onboarding') {
                        console.log('Redirecting to onboarding - incomplete');
                        setHasRedirected(true);
                        router.replace('/onboarding');
                    }
                    return;
                }
            } else {
                // This is onboarding page - should not be accessible if onboarding is complete
                if (user.isOnboardingComplete) {
                    if (currentPath === '/onboarding') {
                        console.log('Redirecting to welcome - onboarding complete');
                        setHasRedirected(true);
                        router.replace('/welcome');
                    }
                    return;
                }
            }
        }
    }, [user, loading, router, requireOnboarding, hasRedirected]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show loading if redirecting
    if (hasRedirected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    // Check if user should see this page
    if (!user) {
        return null;
    }

    if (requireOnboarding && !user.isOnboardingComplete) {
        return null;
    }

    if (!requireOnboarding && user.isOnboardingComplete) {
        return null;
    }

    return children;
}