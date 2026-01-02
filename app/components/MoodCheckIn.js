'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

const MOOD_OPTIONS = [
    { emoji: '😌', label: 'Calm', value: 'calm', description: 'Baseline of mental stability' },
    { emoji: '😊', label: 'Happy', value: 'happy', description: 'Positive emotional uplift' },
    { emoji: '🙏', label: 'Grateful', value: 'grateful', description: 'Emotional warmth + appreciation' },
    { emoji: '💪', label: 'Motivated', value: 'motivated', description: 'Productive, action-focused' },
    { emoji: '🌱', label: 'Healing', value: 'healing', description: 'Growth phase, reflective' },
    { emoji: '🤔', label: 'Lost', value: 'lost', description: 'Mental fog, uncertainty' },
    { emoji: '😔', label: 'Lonely', value: 'lonely', description: 'Emotional disconnection' },
    { emoji: '😢', label: 'Sad', value: 'sad', description: 'Low emotional state' },
    { emoji: '😰', label: 'Stressed', value: 'stressed', description: 'Mental pressure, cognitive load' },
    { emoji: '😟', label: 'Anxious', value: 'anxious', description: 'Future worry, restlessness' },
    { emoji: '😵', label: 'Overwhelmed', value: 'overwhelmed', description: 'Mental + emotional overload' },
    { emoji: '😠', label: 'Angry', value: 'angry', description: 'Intense emotional friction' }
];

export default function MoodCheckIn({ onMoodSaved }) {
    const [selectedMood, setSelectedMood] = useState('');
    const [intensity, setIntensity] = useState(3);
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

                // Track mood entry
                try {
                    const { trackMoodEntry } = await import('../lib/time-tracker');
                    trackMoodEntry();
                } catch (error) {
                    console.log('Time tracking not available:', error);
                }

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
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 max-w-2xl mx-auto border border-rose-100">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                How are you feeling?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Mood Selection */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
                        Select your mood:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                        {MOOD_OPTIONS.map((mood) => (
                            <button
                                key={mood.value}
                                type="button"
                                onClick={() => setSelectedMood(mood.value)}
                                className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${selectedMood === mood.value
                                    ? 'border-rose-500 bg-rose-50 scale-105 shadow-lg'
                                    : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50'
                                    }`}
                                title={mood.description}
                            >
                                <div className="text-xl sm:text-3xl mb-1 sm:mb-2">{mood.emoji}</div>
                                <div className="text-[9px] sm:text-xs font-medium text-gray-700 leading-tight break-words">{mood.label}</div>
                            </button>
                        ))}
                    </div>
                    {selectedMoodData && (
                        <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
                            <p className="text-xs sm:text-sm text-gray-600 text-center">
                                <span className="font-semibold text-rose-600">{selectedMoodData.label}:</span> {selectedMoodData.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Intensity Slider */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                        Intensity Level: {intensity}/5
                    </label>
                    <div className="relative pb-12">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer slider-rose"
                            style={{
                                background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${(intensity - 1) * 25}%, #fecdd3 ${(intensity - 1) * 25}%, #fecdd3 100%)`
                            }}
                        />
                        {/* Selected Mood Emoji on Slider */}
                        {selectedMoodData && (
                            <div
                                className="absolute top-[-40px] transform -translate-x-1/2 transition-all duration-200"
                                style={{ left: `${(intensity - 1) * 25}%` }}
                            >
                                <div className="text-4xl drop-shadow-lg">
                                    {selectedMoodData.emoji}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1 - Mild</span>
                        <span>2</span>
                        <span>3 - Moderate</span>
                        <span>4</span>
                        <span>5 - Intense</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !selectedMood}
                    className="w-full bg-gradient-to-r from-rose-400 to-rose-600 text-white py-3 sm:py-4 px-6 rounded-full text-sm sm:text-base font-semibold hover:from-rose-500 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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