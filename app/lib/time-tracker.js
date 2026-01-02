// Time Tracking System - Track user engagement and session time

class TimeTracker {
    constructor() {
        this.sessionStart = null;
        this.pageStart = null;
        this.currentPage = null;
        this.isActive = true;
        this.sessionData = {
            totalTime: 0,
            pages: {},
            actions: []
        };

        this.initializeTracking();
    }

    initializeTracking() {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        // Track session start
        this.sessionStart = Date.now();
        this.pageStart = Date.now();
        this.currentPage = window.location.pathname;

        // Track page visibility changes
        if (document) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseTracking();
                } else {
                    this.resumeTracking();
                }
            });
        }

        // Track page changes (for SPA)
        this.trackPageChange();

        // Track user interactions
        this.trackUserInteractions();

        // Send data periodically
        this.startPeriodicSync();

        // Send data before page unload
        if (window) {
            window.addEventListener('beforeunload', () => {
                this.endSession();
            });
        }
    }

    trackPageChange() {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        // For Next.js router
        if (typeof window !== 'undefined' && window.next && window.next.router) {
            window.next.router.events.on('routeChangeComplete', (url) => {
                this.changePage(url);
            });
        }

        // Fallback for manual navigation
        if (typeof location !== 'undefined') {
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    this.changePage(location.pathname);
                }
            }).observe(document, { subtree: true, childList: true });
        }
    }

    changePage(newPage) {
        if (this.currentPage && this.pageStart) {
            const timeSpent = Date.now() - this.pageStart;
            this.addPageTime(this.currentPage, timeSpent);
        }

        this.currentPage = newPage;
        this.pageStart = Date.now();

        // Track page view
        this.trackAction('page_view', { page: newPage });
    }

    addPageTime(page, timeSpent) {
        if (!this.sessionData.pages[page]) {
            this.sessionData.pages[page] = 0;
        }
        this.sessionData.pages[page] += timeSpent;
    }

    trackAction(action, data = {}) {
        this.sessionData.actions.push({
            action,
            timestamp: Date.now(),
            page: this.currentPage,
            ...data
        });
    }

    trackUserInteractions() {
        // Only run in browser environment
        if (typeof window === 'undefined' || typeof document === 'undefined') return;

        // Track clicks
        document.addEventListener('click', (e) => {
            try {
                const target = e.target;
                if (!target) return;

                const tagName = target.tagName?.toLowerCase() || '';
                const className = target.className || '';
                const id = target.id || '';

                this.trackAction('click', {
                    element: tagName,
                    className,
                    id,
                    text: target.textContent?.substring(0, 50) || ''
                });
            } catch (error) {
                console.error('Error tracking click:', error);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            try {
                const target = e.target;
                if (!target) return;

                this.trackAction('form_submit', {
                    formId: target.id || '',
                    formClass: target.className || ''
                });
            } catch (error) {
                console.error('Error tracking form submit:', error);
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            try {
                if (!document.body) return;

                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                if (scrollPercent > maxScroll && !isNaN(scrollPercent)) {
                    maxScroll = scrollPercent;
                    if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                        this.trackAction('scroll', { depth: maxScroll });
                    }
                }
            } catch (error) {
                console.error('Error tracking scroll:', error);
            }
        });
    }

    pauseTracking() {
        if (this.isActive && this.pageStart) {
            const timeSpent = Date.now() - this.pageStart;
            this.addPageTime(this.currentPage, timeSpent);
            this.isActive = false;
        }
    }

    resumeTracking() {
        if (!this.isActive) {
            this.pageStart = Date.now();
            this.isActive = true;
        }
    }

    startPeriodicSync() {
        // Send data every 30 seconds
        setInterval(() => {
            this.syncData();
        }, 30000);
    }

    async syncData() {
        if (!this.isActive || typeof window === 'undefined') return;

        try {
            const currentTime = Date.now();
            const sessionTime = currentTime - this.sessionStart;

            // Add current page time
            if (this.pageStart) {
                const currentPageTime = currentTime - this.pageStart;
                this.addPageTime(this.currentPage, currentPageTime);
                this.pageStart = currentTime; // Reset for next interval
            }

            const data = {
                sessionTime,
                pages: { ...this.sessionData.pages },
                actions: [...this.sessionData.actions],
                timestamp: currentTime
            };

            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await fetch('/api/analytics/time-tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Clear sent actions to avoid duplicates
                this.sessionData.actions = [];
            }

        } catch (error) {
            console.error('Failed to sync time tracking data:', error);
        }
    }

    endSession() {
        this.pauseTracking();
        this.syncData();
    }

    // Public methods for manual tracking
    trackChatMessage() {
        this.trackAction('chat_message');
    }

    trackMoodEntry() {
        this.trackAction('mood_entry');
    }

    trackJournalEntry() {
        this.trackAction('journal_entry');
    }

    trackGoalAction(action) {
        this.trackAction('goal_action', { goalAction: action });
    }
}

// Singleton instance
let timeTracker = null;

export function initializeTimeTracking() {
    // Only initialize in browser environment and if not already initialized
    if (typeof window === 'undefined' || timeTracker) {
        return timeTracker;
    }

    try {
        timeTracker = new TimeTracker();
        return timeTracker;
    } catch (error) {
        console.error('Failed to initialize TimeTracker:', error);
        return null;
    }
}

export function getTimeTracker() {
    return timeTracker;
}

// Helper functions for easy tracking
export function trackAction(action, data) {
    if (timeTracker) {
        timeTracker.trackAction(action, data);
    }
}

export function trackChatMessage() {
    if (timeTracker) {
        timeTracker.trackChatMessage();
    }
}

export function trackMoodEntry() {
    if (timeTracker) {
        timeTracker.trackMoodEntry();
    }
}

export function trackJournalEntry() {
    if (timeTracker) {
        timeTracker.trackJournalEntry();
    }
}

export function trackGoalAction(action) {
    if (timeTracker) {
        timeTracker.trackGoalAction(action);
    }
}