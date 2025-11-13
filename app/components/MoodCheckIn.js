'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

const MOOD_OPTIONS = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😠', label: 'Angry', value: 'angry' },
    { emoji: '😰', label: 'Stressed', value: 'stressed' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '🤗', label: 'Excited', value: 'excited' },
    { emoji: '😔', label: 'Disappointed', value: 'disappointed' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
    { emoji: '🥰', label: 'Loved', value: 'loved' }
];

export default function MoodCheckIn({ onMoodSaved }) {
    const [selectedMood, setSelectedMood] = useState('happy');
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
            const response = await api.post('/api/mood-mongo', {
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

    const selectedMoodData = MOOD_OPTIONS.find(m => m.value === selectedMood);

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-rose-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                How are you feeling?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mood Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Select your mood:
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                        {MOOD_OPTIONS.map((mood) => (
                            <button
                                key={mood.value}
                                type="button"
                                onClick={() => setSelectedMood(mood.value)}
                                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${selectedMood === mood.value
                                    ? 'border-rose-500 bg-rose-50 scale-105 shadow-lg'
                                    : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{mood.emoji}</div>
                                <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Intensity Slider */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Intensity: {intensity}/10
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer slider-rose"
                            style={{
                                background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${(intensity - 1) * 11.11}%, #fecdd3 ${(intensity - 1) * 11.11}%, #fecdd3 100%)`
                            }}
                        />
                        {/* Selected Mood Emoji on Slider */}
                        {selectedMoodData && (
                            <div
                                className="absolute top-[-40px] transform -translate-x-1/2 transition-all duration-200"
                                style={{ left: `${(intensity - 1) * 11.11}%` }}
                            >
                                <div className="text-4xl drop-shadow-lg">
                                    {selectedMoodData.emoji}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !selectedMood}
                    className="w-full bg-gradient-to-r from-rose-400 to-rose-600 text-white py-4 px-6 rounded-full font-semibold hover:from-rose-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {isSubmitting ? 'Saving...' : 'Save Mood'}
                </button>
            </form>

            {/* Message */}
            {message && (
                <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${message.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message}
                </div>
            )}

            <style jsx>{`
                .slider-rose::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #fb7185;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(251, 113, 133, 0.4);
                    transition: all 0.2s;
                }
                
                .slider-rose::-webkit-slider-thumb:hover {
                    background: #f43f5e;
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.5);
                }
                
                .slider-rose::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #fb7185;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 8px rgba(251, 113, 133, 0.4);
                    transition: all 0.2s;
                }
                
                .slider-rose::-moz-range-thumb:hover {
                    background: #f43f5e;
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.5);
                }
            `}</style>
        </div>
    );
}