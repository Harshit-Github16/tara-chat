'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export function useOnboardingCheck() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function checkOnboarding() {
            // Skip check if still loading auth or no user
            if (loading || !user) {
                setChecking(false);
                return;
            }

            // Skip check if already on onboarding page or welcome page
            if (pathname === '/onboarding' || pathname === '/welcome') {
                setChecking(false);
                return;
            }

            try {
                const response = await fetch('/api/onboarding/emotional/status');

                if (response.ok) {
                    const data = await response.json();

                    // If onboarding not completed, redirect to onboarding
                    if (!data.onboardingCompleted) {
                        router.push('/onboarding');
                    }
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            } finally {
                setChecking(false);
            }
        }

        checkOnboarding();
    }, [user, loading, pathname, router]);

    return { checking };
}
