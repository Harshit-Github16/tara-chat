'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const MOOD_EMOJIS = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    tired: '😴',
    calm: '😌',
    excited: '🤗',
    disappointed: '😔',
    frustrated: '😤',
    loved: '🥰'
};

export default function MoodHistory() {
    const [moodHistory, setMoodHistory] = useState([]);
    const [todayMoods, setTodayMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMoodData();
    }, []);

    const fetchMoodData = async () => {
        try {
            setLoading(true);

            // Fetch today's moods
            const todayResponse = await api.get('/api/mood');
            if (todayResponse.ok) {
                const todayData = await todayResponse.json();
                setTodayMoods(todayData.data.entries || []);
            }

            // Fetch mood history
            const historyResponse = await api.get('/api/mood/history?days=7');
            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                setMoodHistory(historyData.data || []);
            }
        } catch (error) {
            console.error('Error fetching mood data:', error);
            setError('Failed to load mood data');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-red-600 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Today's Moods */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Today's Moods ({todayMoods.length})
                </h3>

                {todayMoods.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No moods recorded today. How are you feeling?
                    </p>
                ) : (
                    <div className="space-y-3">
                        {todayMoods.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{MOOD_EMOJIS[entry.mood] || '😐'}</span>
                                    <div>
                                        <div className="font-medium capitalize">{entry.mood}</div>
                                        <div className="text-sm text-gray-500">
                                            Intensity: {entry.intensity}/10
                                        </div>
                                        {entry.note && (
                                            <div className="text-sm text-gray-600 mt-1">"{entry.note}"</div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatTime(entry.timestamp)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mood History */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent History (Last 7 Days)
                </h3>

                {moodHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        No mood history available
                    </p>
                ) : (
                    <div className="space-y-4">
                        {moodHistory.map((dayData) => (
                            <div key={dayData.id} className="border-l-4 border-blue-200 pl-4">
                                <div className="font-medium text-gray-800 mb-2">
                                    {formatDate(dayData.date)} ({dayData.entries.length} entries)
                                </div>

                                <div className="space-y-2">
                                    {dayData.entries.map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{MOOD_EMOJIS[entry.mood] || '😐'}</span>
                                                <span className="capitalize">{entry.mood}</span>
                                                <span className="text-gray-500">({entry.intensity}/10)</span>
                                            </div>
                                            <span className="text-gray-400">
                                                {formatTime(entry.timestamp)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}