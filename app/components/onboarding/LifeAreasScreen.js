'use client';

import { useState } from 'react';

const lifeAreas = [
    { icon: '❤️', label: 'Relationship', value: 'relationship' },
    { icon: '🏠', label: 'Family', value: 'family' },
    { icon: '💼', label: 'Work', value: 'work' },
    { icon: '💰', label: 'Financial', value: 'financial' },
    { icon: '🧠', label: 'Mental wellbeing', value: 'mental' },
    { icon: '💪', label: 'Health', value: 'health' },
    { icon: '🧘', label: 'Self-growth', value: 'self_growth' }
];

export default function LifeAreasScreen({ onNext }) {
    const [selected, setSelected] = useState([]);

    const toggleArea = (area) => {
        if (selected.includes(area.value)) {
            setSelected(selected.filter(v => v !== area.value));
        } else if (selected.length < 3) {
            setSelected([...selected, area.value]);
        }
    };

    const handleContinue = () => {
        if (selected.length > 0) {
            onNext(selected);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Which areas of life matter most to you right now?
                    </h2>
                    <p className="text-gray-600">Select 2-3 areas to focus on</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {lifeAreas.map((area) => (
                        <button
                            key={area.value}
                            onClick={() => toggleArea(area)}
                            disabled={!selected.includes(area.value) && selected.length >= 3}
                            className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${selected.includes(area.value)
                                    ? 'border-rose-500 bg-rose-50 shadow-lg'
                                    : selected.length >= 3
                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                        : 'border-gray-200 bg-white hover:border-rose-300'
                                }`}
                        >
                            <div className="text-4xl mb-2">{area.icon}</div>
                            <div className="text-base font-semibold text-gray-800">{area.label}</div>
                        </button>
                    ))}
                </div>

                <div className="text-sm text-gray-600">
                    Selected: {selected.length} / 3
                </div>

                <button
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    className={`px-10 py-4 rounded-full text-lg font-semibold shadow-lg transition-all ${selected.length > 0
                            ? 'bg-gradient-to-r from-rose-400 to-rose-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
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
