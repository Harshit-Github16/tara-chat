'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

const MOOD_OPTIONS = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😠', label: 'Angry', value: 'angry' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '🤗', label: 'Excited', value: 'excited' },
    { emoji: '😔', label: 'Disappointed', value: 'disappointed' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🥰', label: 'Loved', value: 'loved' }
];

export default function MoodCheckIn({ onMoodSaved }) {
    const [selectedMood, setSelectedMood] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMood) {
            setMessage('Please select a mood');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await api.post('/api/mood', {
                mood: selectedMood,
                intensity,
                note
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Mood saved successfully! 🎉');

                // Reset form
                setSelectedMood('');
                setIntensity(5);
                setNote('');

                // Callback to parent component
                if (onMoodSaved) {
                    onMoodSaved(result.entry);
                }
            } else {
                const error = await response.json();
                setMessage(error.error || 'Failed to save mood');
            }
        } catch (error) {
            console.error('Error saving mood:', error);
            setMessage('Failed to save mood. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                How are you feeling?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mood Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select your mood:
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {MOOD_OPTIONS.map((mood) => (
                            <button
                                key={mood.value}
                                type="button"
                                onClick={() => setSelectedMood(mood.value)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedMood === mood.value
                                    ? 'border-blue-500 bg-blue-50 scale-105'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{mood.emoji}</div>
                                <div className="text-xs text-gray-600">{mood.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intensity Slider */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intensity: {intensity}/10
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add a note (optional):
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's on your mind?"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !selectedMood}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isSubmitting ? 'Saving...' : 'Save Mood'}
                </button>
            </form>

            {/* Message */}
            {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('successfully')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}