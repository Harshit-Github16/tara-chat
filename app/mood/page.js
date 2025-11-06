'use client';

import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import MoodCheckIn from '../components/MoodCheckIn';
import MoodHistory from '../components/MoodHistory';

export default function MoodPage() {
    const [refreshHistory, setRefreshHistory] = useState(0);

    const handleMoodSaved = (newEntry) => {
        // Trigger refresh of mood history
        setRefreshHistory(prev => prev + 1);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Mood Tracker
                        </h1>
                        <p className="text-gray-600">
                            Track your daily emotions and see patterns over time
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Mood Check-in */}
                        <div>
                            <MoodCheckIn onMoodSaved={handleMoodSaved} />
                        </div>

                        {/* Mood History */}
                        <div>
                            <MoodHistory key={refreshHistory} />
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-12 bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">
                            💡 Mood Tracking Tips
                        </h3>
                        <ul className="text-blue-800 space-y-2 text-sm">
                            <li>• Check in with your mood multiple times throughout the day</li>
                            <li>• Be honest about your feelings - there are no wrong emotions</li>
                            <li>• Use the notes section to capture what might be influencing your mood</li>
                            <li>• Look for patterns in your mood history to understand your emotional cycles</li>
                            <li>• Consider factors like sleep, exercise, and social interactions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}