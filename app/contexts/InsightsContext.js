"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from './AuthContext';

const InsightsContext = createContext();

export function InsightsProvider({ children }) {
    const { user } = useAuth();
    const [moodData, setMoodData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [quizResults, setQuizResults] = useState(null);
    const [insightsStats, setInsightsStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // Only fetch once when user is available and we haven't fetched yet
        if (user?.uid && !hasFetched) {
            fetchAllData();
            setHasFetched(true);
        } else if (!user?.uid) {
            setLoading(false);
            setHasFetched(false);
        }
    }, [user?.uid, hasFetched]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel - single time only
            // Use insights endpoint for calculated mood data
            const [moodInsightsResponse, userDataResponse, quizResponse, insightsStatsResponse] = await Promise.all([
                api.get('/api/mood-mongo/insights'),
                api.get('/api/user-data'),
                api.get('/api/quiz/results'),
                api.get('/api/insights/stats')
            ]);

            // Process mood insights data (already calculated on backend)
            if (moodInsightsResponse.ok) {
                const moodResult = await moodInsightsResponse.json();
                setMoodData(moodResult.data || {});
            }

            // Process user data
            if (userDataResponse.ok) {
                const userResult = await userDataResponse.json();
                setUserData(userResult.data || userResult);
            }

            // Process quiz results
            if (quizResponse.ok) {
                const quizResult = await quizResponse.json();
                setQuizResults(quizResult);
            }

            // Process insights stats
            if (insightsStatsResponse.ok) {
                const statsResult = await insightsStatsResponse.json();
                setInsightsStats(statsResult.data || {});
            }

        } catch (err) {
            console.error('Error fetching insights data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        if (user?.uid) {
            fetchAllData();
        }
    };

    return (
        <InsightsContext.Provider value={{
            moodData,
            userData,
            quizResults,
            insightsStats,
            loading,
            error,
            refreshData
        }}>
            {children}
        </InsightsContext.Provider>
    );
}

export function useInsights() {
    const context = useContext(InsightsContext);
    if (!context) {
        throw new Error('useInsights must be used within InsightsProvider');
    }
    return context;
}
