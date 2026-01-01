// Activity Tracker - Automatically track user's daily login/activity
import { API_BASE_URL } from "../../lib/api";


/**
 * Track user's daily activity (login/visit)
 * This creates a daily entry in the mood collection to show check-in on calendar
 * Only creates one entry per day
 */
export async function trackDailyActivity(userId) {
    if (!userId) {
        console.log('Activity Tracker: No userId provided');
        return { success: false, error: 'No userId' };
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        // Check if already tracked today
        const checkResponse = await fetch(`${API_BASE_URL}/api/mood-mongo?date=${today}`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (checkResponse.ok) {
            const data = await checkResponse.json();
            const todayEntries = data.data?.entries || [];

            // If already has entry for today, don't create another
            if (todayEntries.length > 0) {
                console.log('Activity Tracker: Already tracked today');
                return { success: true, alreadyTracked: true };
            }
        }

        // Create daily activity entry (as a mood entry with special flag)
        const response = await fetch(`${API_BASE_URL}/api/mood-mongo`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                mood: 'active', // Special mood type for activity tracking
                intensity: 5,
                note: 'Daily login',
                isActivityTracker: true // Flag to identify this as activity tracking
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Activity Tracker: Daily activity tracked successfully');
            return { success: true, data };
        } else {
            console.error('Activity Tracker: Failed to track activity');
            return { success: false, error: 'Failed to track' };
        }
    } catch (error) {
        console.error('Activity Tracker Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if user has checked in today
 */
export async function hasCheckedInToday() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const response = await fetch(`${API_BASE_URL}/api/mood-mongo?date=${today}`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const todayEntries = data.data?.entries || [];
            return todayEntries.length > 0;
        }

        return false;
    } catch (error) {
        console.error('Check-in status error:', error);
        return false;
    }
}
