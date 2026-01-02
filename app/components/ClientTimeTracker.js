'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ClientTimeTracker() {
    const { user, loading } = useAuth();

    useEffect(() => {
        // Only run on client side and when user is authenticated
        if (typeof window === 'undefined' || loading || !user) return;

        // Simple time tracking without dynamic imports
        let sessionStart = Date.now();
        let currentPage = window.location.pathname;
        let pageStart = Date.now();
        let sessionData = {
            pages: {},
            actions: []
        };

        const addPageTime = (page, time) => {
            if (!sessionData.pages[page]) {
                sessionData.pages[page] = 0;
            }
            sessionData.pages[page] += time;
        };

        const trackAction = (action, data = {}) => {
            sessionData.actions.push({
                action,
                timestamp: Date.now(),
                page: currentPage,
                ...data
            });
        };

        const syncData = async () => {
            try {
                const currentTime = Date.now();
                const sessionTime = currentTime - sessionStart;

                if (pageStart) {
                    const currentPageTime = currentTime - pageStart;
                    addPageTime(currentPage, currentPageTime);
                    pageStart = currentTime;
                }

                const data = {
                    sessionTime,
                    pages: { ...sessionData.pages },
                    actions: [...sessionData.actions],
                    timestamp: currentTime
                };

                console.log('Syncing time tracking data:', data);

                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.log('No auth token found for time tracking');
                    return;
                }

                const response = await fetch('/api/analytics/time-tracking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    console.log('Time tracking data synced successfully');
                    sessionData.actions = [];
                } else {
                    const error = await response.text();
                    console.error('Failed to sync time tracking data:', response.status, error);
                }
            } catch (error) {
                console.error('Failed to sync time tracking:', error);
            }
        };

        // Track page changes
        const handlePageChange = () => {
            const newPage = window.location.pathname;
            if (newPage !== currentPage) {
                if (pageStart) {
                    const timeSpent = Date.now() - pageStart;
                    addPageTime(currentPage, timeSpent);
                }
                currentPage = newPage;
                pageStart = Date.now();
                trackAction('page_view', { page: newPage });
            }
        };

        // Track clicks
        const handleClick = (e) => {
            try {
                const target = e.target;
                if (target) {
                    trackAction('click', {
                        element: target.tagName?.toLowerCase() || '',
                        text: target.textContent?.substring(0, 50) || ''
                    });
                }
            } catch (error) {
                // Ignore click tracking errors
            }
        };

        // Set up event listeners
        document.addEventListener('click', handleClick);

        // Track page changes for SPA
        const observer = new MutationObserver(handlePageChange);
        observer.observe(document, { subtree: true, childList: true });

        // Sync data every 10 seconds for testing (change back to 30000 later)
        const syncInterval = setInterval(syncData, 10000);

        // Also sync immediately after 5 seconds to test
        setTimeout(() => {
            console.log('Initial sync after 5 seconds');
            syncData();
        }, 5000);

        // Sync on page unload
        const handleUnload = () => {
            syncData();
        };
        window.addEventListener('beforeunload', handleUnload);

        console.log('Simple time tracking initialized for user:', user.uid);

        // Add a visual indicator that tracking is active (for debugging)
        if (typeof window !== 'undefined') {
            const indicator = document.createElement('div');
            indicator.id = 'time-tracking-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: green;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 9999;
                pointer-events: none;
            `;
            indicator.textContent = 'Time Tracking Active';
            document.body.appendChild(indicator);

            // Remove after 3 seconds
            setTimeout(() => {
                const el = document.getElementById('time-tracking-indicator');
                if (el) el.remove();
            }, 3000);
        }

        // Cleanup
        return () => {
            document.removeEventListener('click', handleClick);
            observer.disconnect();
            clearInterval(syncInterval);
            window.removeEventListener('beforeunload', handleUnload);
            syncData(); // Final sync
        };
    }, [user, loading]);

    return null; // This component doesn't render anything
}