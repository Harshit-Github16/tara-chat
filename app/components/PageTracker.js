"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function PageTracker() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !user?.uid || !pathname) return;

        // Simple tracking without the complex hook to avoid SSR issues
        const trackPageView = async () => {
            try {
                const sessionId = sessionStorage.getItem('tara_session_id') ||
                    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                if (!sessionStorage.getItem('tara_session_id')) {
                    sessionStorage.setItem('tara_session_id', sessionId);
                }

                await fetch('/api/analytics/time-tracking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        sessionId,
                        page: pathname,
                        action: 'enter',
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent,
                        referrer: document.referrer
                    })
                });
            } catch (error) {
                console.error('Page tracking error:', error);
            }
        };

        trackPageView();
    }, [isClient, user?.uid, pathname]);

    return null;
}