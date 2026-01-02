import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Generate unique session ID
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = () => {
    if (typeof window === 'undefined') return null;

    let sessionId = sessionStorage.getItem('tara_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('tara_session_id', sessionId);
    }
    return sessionId;
};

// Simple debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const usePageTracking = (pageName) => {
    const { user } = useAuth();
    const startTimeRef = useRef(null);
    const lastHeartbeatRef = useRef(null);
    const isTrackingRef = useRef(false);
    const lastCallRef = useRef({});

    const trackEvent = useCallback(async (action, additionalData = {}) => {
        if (!user?.uid || !pageName || typeof window === 'undefined') return;

        try {
            const sessionId = getSessionId();
            if (!sessionId) return;

            const timestamp = Date.now();
            const callKey = `${user.uid}-${pageName}-${action}`;

            // Prevent duplicate calls within 1 second
            if (lastCallRef.current[callKey] &&
                timestamp - lastCallRef.current[callKey] < 1000) {
                return;
            }
            lastCallRef.current[callKey] = timestamp;

            const trackingData = {
                userId: user.uid,
                sessionId,
                page: pageName,
                action,
                timestamp,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                ...additionalData
            };

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackingData)
            };

            if (action === 'exit') {
                options.keepalive = true;
            }

            await fetch('/api/analytics/time-tracking', options);
        } catch (error) {
            console.error('Tracking error:', error);
        }
    }, [user?.uid, pageName]);

    // Debounced version
    const debouncedTrackEvent = useCallback(
        debounce(trackEvent, 500),
        [trackEvent]
    );

    const trackPageEnter = useCallback(() => {
        if (isTrackingRef.current) return;

        startTimeRef.current = Date.now();
        lastHeartbeatRef.current = Date.now();
        isTrackingRef.current = true;

        trackEvent('enter');
    }, [trackEvent]);

    const trackPageExit = useCallback(() => {
        if (!isTrackingRef.current || !startTimeRef.current) return;

        const timeSpent = Date.now() - startTimeRef.current;
        trackEvent('exit', { timeSpent });

        isTrackingRef.current = false;
        startTimeRef.current = null;
    }, [trackEvent]);

    const sendHeartbeat = useCallback(() => {
        if (!isTrackingRef.current || !startTimeRef.current) return;

        const now = Date.now();
        const timeSinceLastHeartbeat = now - (lastHeartbeatRef.current || now);

        // Only send heartbeat if user has been active (less than 2 minutes)
        if (timeSinceLastHeartbeat < 120000) {
            trackEvent('heartbeat', {
                timeSpent: now - startTimeRef.current
            });
            lastHeartbeatRef.current = now;
        }
    }, [trackEvent]);

    useEffect(() => {
        if (!user?.uid || !pageName || typeof window === 'undefined') return;

        // Track page enter
        trackPageEnter();

        // Set up heartbeat interval (every 30 seconds)
        const heartbeatInterval = setInterval(sendHeartbeat, 30000);

        // Track user activity
        const resetHeartbeat = () => {
            lastHeartbeatRef.current = Date.now();
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, resetHeartbeat, { passive: true });
        });

        // Track page exit
        const handleBeforeUnload = () => {
            trackPageExit();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                trackPageExit();
            } else if (document.visibilityState === 'visible' && !isTrackingRef.current) {
                trackPageEnter();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            clearInterval(heartbeatInterval);
            events.forEach(event => {
                document.removeEventListener(event, resetHeartbeat);
            });
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            trackPageExit();
        };
    }, [user?.uid, pageName, trackPageEnter, trackPageExit, sendHeartbeat]);

    return {
        trackEvent: debouncedTrackEvent,
        sessionId: getSessionId()
    };
};