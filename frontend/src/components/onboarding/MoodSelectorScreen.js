'use client';

import { useState } from 'react';

const moods = [
    { emoji: '🙂', label: 'Calm', value: 'calm' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Low', value: 'low' },
    { emoji: '😣', label: 'Stressed', value: 'stressed' },
    { emoji: '😡', label: 'Irritated', value: 'irritated' },
    { emoji: '😭', label: 'Overwhelmed', value: 'overwhelmed' }
];

export default function MoodSelectorScreen({ onNext }) {
    const [selected, setSelected] = useState(null);

    const handleSelect = (mood) => {
        setSelected(mood.value);
        // Auto-advance after selection with slight delay
        setTimeout(() => {
            onNext(mood.value);
        }, 300);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900">
                    How are you feeling right now?
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {moods.map((mood) => (
                        <button
                            key={mood.value}
                            onClick={() => handleSelect(mood)}
                            className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${selected === mood.value
                                    ? 'border-rose-500 bg-rose-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-rose-300'
                                }`}
                        >
                            <div className="text-5xl mb-2">{mood.emoji}</div>
                            <div className="text-lg font-semibold text-gray-800">{mood.label}</div>
                        </button>
                    ))}
                </div>

                <p className="text-sm text-gray-600">
                    This helps Tara understand your emotional baseline
                </p>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}
