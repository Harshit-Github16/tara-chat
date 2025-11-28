import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to analyze user patterns and determine if DASS-21 should be suggested
 * @param {Object} options - Configuration options
 * @param {number} options.daysToAnalyze - Number of days to analyze (default: 3)
 * @param {string} options.chatUserId - Chat user ID to analyze (default: 'tara-ai')
 * @param {boolean} options.autoCheck - Whether to automatically check on mount (default: true)
 * @returns {Object} - Pattern analysis state and methods
 */
export function usePatternAnalysis({
    daysToAnalyze = 3,
    chatUserId = 'tara-ai',
    autoCheck = true
} = {}) {
    const { user } = useAuth();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldSuggestDASS21, setShouldSuggestDASS21] = useState(false);

    /**
     * Fetch pattern analysis from API
     */
    const checkPattern = async () => {
        if (!user) {
            console.log('usePatternAnalysis: No user logged in');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `/api/pattern-analysis?days=${daysToAnalyze}&chatUserId=${chatUserId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch pattern analysis');
            }

            const data = await response.json();

            if (data.success) {
                setAnalysis(data.analysis);
                setShouldSuggestDASS21(data.shouldSuggestDASS21);

                console.log('Pattern Analysis Result:', {
                    shouldSuggest: data.shouldSuggestDASS21,
                    stressScore: data.analysis.combinedStressScore,
                    confidence: data.analysis.confidence
                });
            }
        } catch (err) {
            console.error('Error checking pattern:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reset the suggestion (e.g., after user dismisses or completes DASS-21)
     */
    const dismissSuggestion = () => {
        setShouldSuggestDASS21(false);
    };

    // Auto-check on mount if enabled
    useEffect(() => {
        if (autoCheck && user) {
            checkPattern();
        }
    }, [user, autoCheck]);

    return {
        analysis,
        loading,
        error,
        shouldSuggestDASS21,
        checkPattern,
        dismissSuggestion
    };
}

/**
 * Hook to monitor chat responses for DASS-21 suggestions
 * This hook checks the patternAnalysis field returned from chat API
 */
export function useChatPatternMonitor() {
    const [shouldSuggestDASS21, setShouldSuggestDASS21] = useState(false);
    const [patternInfo, setPatternInfo] = useState(null);

    /**
     * Process chat response to check for pattern analysis
     * @param {Object} chatResponse - Response from chat API
     */
    const processChatResponse = (chatResponse) => {
        if (chatResponse?.patternAnalysis) {
            const { shouldSuggest, stressScore, confidence, consecutiveStressedDays } = chatResponse.patternAnalysis;

            if (shouldSuggest) {
                setShouldSuggestDASS21(true);
                setPatternInfo({
                    stressScore,
                    confidence,
                    consecutiveStressedDays
                });

                console.log('DASS-21 suggestion triggered from chat:', {
                    stressScore,
                    confidence,
                    consecutiveStressedDays
                });
            }
        }
    };

    /**
     * Dismiss the suggestion
     */
    const dismissSuggestion = () => {
        setShouldSuggestDASS21(false);
        setPatternInfo(null);
    };

    return {
        shouldSuggestDASS21,
        patternInfo,
        processChatResponse,
        dismissSuggestion
    };
}
