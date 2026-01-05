"use client";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function GlobalPageTracker() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isClient, setIsClient] = useState(false);
    const lastTrackingCall = useRef({});
    const startTimeRef = useRef(null);
    const lastHeartbeatRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !user?.uid || !pathname) return;

        startTimeRef.current = Date.now();
        lastHeartbeatRef.current = Date.now();
        let sessionId = null;

        // Get or create session ID
        try {
            sessionId = sessionStorage.getItem('tara_session_id');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('tara_session_id', sessionId);
            }
        } catch (error) {
            console.error('Session storage error:', error);
            return;
        }

        // Prevent duplicate tracking calls
        const canTrack = (action) => {
            const key = `${user.uid}-${pathname}-${action}`;
            const now = Date.now();

            if (lastTrackingCall.current[key] && now - lastTrackingCall.current[key] < 5000) {
                return false; // Prevent calls within 5 seconds
            }

            lastTrackingCall.current[key] = now;
            return true;
        };

        // Track page enter (only once per page visit)
        const trackPageEnter = async () => {
            if (!canTrack('enter')) return;

            console.log('🔍 Tracking page enter:', pathname, 'User:', user.email);

            try {
                const response = await fetch('/api/analytics/time-tracking', {
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

                if (response.ok) {
                    console.log('✅ Page tracking successful for:', pathname);
                } else {
                    console.error('❌ Page tracking failed:', response.status);
                }
            } catch (error) {
                console.error('Page enter tracking error:', error);
            }
        };

        // Track page exit
        const trackPageExit = async () => {
            if (!startTimeRef.current) return;

            const now = Date.now();
            const timeSpent = now - (lastHeartbeatRef.current || startTimeRef.current);
            lastHeartbeatRef.current = now; // Update last heartbeat to avoid double counting

            if (timeSpent < 100) return; // Ignore negligible time

            try {
                await fetch('/api/analytics/time-tracking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        sessionId,
                        page: pathname,
                        action: 'exit',
                        timestamp: now,
                        timeSpent, // Incremental time
                        userAgent: navigator.userAgent,
                        referrer: document.referrer
                    }),
                    keepalive: true
                });
            } catch (error) {
                console.error('Page exit tracking error:', error);
            }
        };

        // Track heartbeat (throttled)
        const trackHeartbeat = async () => {
            if (!canTrack('heartbeat') || !startTimeRef.current) return;

            const now = Date.now();
            const timeSpent = now - (lastHeartbeatRef.current || startTimeRef.current);
            lastHeartbeatRef.current = now;

            if (timeSpent < 1000) return; // Don't track if less than 1 second

            try {
                await fetch('/api/analytics/time-tracking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        sessionId,
                        page: pathname,
                        action: 'heartbeat',
                        timestamp: now,
                        timeSpent, // Incremental time
                        userAgent: navigator.userAgent,
                        referrer: document.referrer
                    })
                });
            } catch (error) {
                console.error('Heartbeat tracking error:', error);
            }
        };

        // Start tracking
        console.log('🚀 Starting page tracking for:', pathname, 'User:', user.email);
        trackPageEnter();

        // Set up heartbeat (every 30 seconds)
        const heartbeatInterval = setInterval(trackHeartbeat, 30000);

        // Track page exit events
        const handleBeforeUnload = () => {
            trackPageExit();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                trackPageExit();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            clearInterval(heartbeatInterval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            trackPageExit();
        };
    }, [isClient, user?.uid, pathname]);

    return null;
}