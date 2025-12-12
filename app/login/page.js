'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(true);

    // If user is already logged in, redirect to welcome
    useEffect(() => {
        if (!loading && user) {
            const redirectUrl = searchParams.get('redirect') || '/welcome';
            router.replace(redirectUrl);
        }
    }, [user, loading, router, searchParams]);

    const handleLoginSuccess = (isNewUser, userData) => {
        const redirectUrl = searchParams.get('redirect') || '/welcome';

        if (isNewUser || !userData.isOnboardingComplete) {
            // Store redirect URL for after onboarding
            localStorage.setItem('redirectAfterLogin', redirectUrl);
            router.push('/?showOnboarding=true');
        } else {
            router.push(redirectUrl);
        }
    };

    const handleClose = () => {
        // Redirect to home page if user closes login modal
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <img
                        src="/taralogo.jpg"
                        alt="Tara Logo"
                        className="mx-auto h-20 w-20 rounded-full object-cover mb-4 animate-pulse"
                    />
                    <h1 className="text-2xl font-bold text-rose-600 mb-2">Loading...</h1>
                </div>
            </div>
        );
    }

    if (user) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <LoginModal
                isOpen={showLoginModal}
                onClose={handleClose}
                onLoginSuccess={handleLoginSuccess}
                showCloseButton={true}
            />
        </div>
    );
}