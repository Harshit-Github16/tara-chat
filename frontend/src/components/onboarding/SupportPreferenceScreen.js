'use client';

import { useState } from 'react';

const preferences = [
    {
        id: 'calming_voice',
        icon: '🎵',
        title: 'A calming voice',
        description: 'Soothing words to ease your mind'
    },
    {
        id: 'problem_solving',
        icon: '🧩',
        title: 'Simple steps to solve the problem',
        description: 'Practical solutions and action plans'
    },
    {
        id: 'express_feelings',
        icon: '💭',
        title: 'A space to express feelings',
        description: 'Safe place to share what you feel'
    },
    {
        id: 'quick_motivation',
        icon: '⚡',
        title: 'Quick motivation',
        description: 'Energizing boost when you need it'
    },
    {
        id: 'deep_insights',
        icon: '🔮',
        title: 'Deep emotional insights',
        description: 'Understanding the why behind emotions'
    }
];

export default function SupportPreferenceScreen({ onNext }) {
    const [selected, setSelected] = useState(null);

    const handleSelect = (pref) => {
        setSelected(pref.id);
        setTimeout(() => {
            onNext(pref.id);
        }, 300);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        When you're upset, what helps you most?
                    </h2>
                    <p className="text-gray-600">Choose the support style that resonates with you</p>
                </div>

                <div className="space-y-4">
                    {preferences.map((pref) => (
                        <button
                            key={pref.id}
                            onClick={() => handleSelect(pref)}
                            className={`w-full p-6 rounded-2xl border-2 transition-all hover:scale-102 active:scale-98 text-left ${selected === pref.id
                                    ? 'border-rose-500 bg-rose-50 shadow-lg'
                                    : 'border-gray-200 bg-white hover:border-rose-300'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl flex-shrink-0">{pref.icon}</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {pref.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{pref.description}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === pref.id
                                        ? 'border-rose-500 bg-rose-500'
                                        : 'border-gray-300'
                                    }`}>
                                    {selected === pref.id && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
        </div>
    );
}
