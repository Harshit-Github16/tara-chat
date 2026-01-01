'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

const archetypes = {
    empathic_explorer: {
        name: 'Empathic Explorer',
        emoji: '🌸',
        description: 'You feel deeply, you care strongly, and you grow beautifully through reflection.',
        strengths: ['Deep emotional awareness', 'Strong empathy', 'Reflective nature', 'Open to growth'],
        triggers: ['Overwhelming emotions', 'Conflict situations', 'Feeling misunderstood'],
        support: 'Tara will provide you with a safe space for reflection, gentle guidance through emotions, and tools for emotional balance.'
    },
    thoughtful_thinker: {
        name: 'Thoughtful Thinker',
        emoji: '🧠',
        description: 'You analyze, understand, and solve problems with clarity and logic.',
        strengths: ['Analytical mindset', 'Problem-solving skills', 'Calm under pressure', 'Strategic thinking'],
        triggers: ['Emotional overwhelm', 'Lack of structure', 'Uncertainty'],
        support: 'Tara will offer practical solutions, structured approaches, and logical frameworks to navigate emotions.'
    },
    energetic_driver: {
        name: 'Energetic Driver',
        emoji: '⚡',
        description: 'You are motivated, goal-oriented, and thrive on achievement and progress.',
        strengths: ['High motivation', 'Goal-focused', 'Resilient', 'Action-oriented'],
        triggers: ['Setbacks', 'Lack of progress', 'Feeling stuck'],
        support: 'Tara will keep you motivated, celebrate wins, and help you push through challenges with energy.'
    },
    calm_stabilizer: {
        name: 'Calm Stabilizer',
        emoji: '🌊',
        description: 'You bring peace, consistency, and balance to yourself and others.',
        strengths: ['Emotional stability', 'Consistent routines', 'Calming presence', 'Reliable'],
        triggers: ['Chaos', 'Sudden changes', 'Conflict'],
        support: 'Tara will help maintain your inner peace, provide grounding techniques, and support your steady growth.'
    },
    caring_supporter: {
        name: 'Caring Supporter',
        emoji: '💝',
        description: 'You nurture others, prioritize relationships, and find joy in helping.',
        strengths: ['Strong relationships', 'Nurturing nature', 'Compassionate', 'Great listener'],
        triggers: ['Feeling unappreciated', 'Neglecting self-care', 'Others in pain'],
        support: 'Tara will remind you to care for yourself, validate your feelings, and help you set healthy boundaries.'
    }
};

function calculateArchetype(data) {
    // Simple algorithm based on personality answers
    const answers = data.personalityAnswers || [];
    const lifeAreas = data.lifeAreas || [];
    const support = data.supportPreference;

    // Calculate scores
    let empathy = 0, thinking = 0, energy = 0, stability = 0, caring = 0;

    answers.forEach(answer => {
        if (answer.questionId === 4) empathy += answer.value;
        if (answer.questionId === 1) empathy += answer.value;
        if ([2, 8].includes(answer.questionId)) stability += answer.value;
        if ([9, 7].includes(answer.questionId)) energy += answer.value;
        if ([10, 12].includes(answer.questionId)) thinking += answer.value;
    });

    if (lifeAreas.includes('relationship') || lifeAreas.includes('family')) caring += 2;
    if (support === 'deep_insights') empathy += 2;
    if (support === 'problem_solving') thinking += 2;
    if (support === 'quick_motivation') energy += 2;
    if (support === 'calming_voice') stability += 2;
    if (support === 'express_feelings') caring += 2;

    // Determine archetype
    const scores = { empathy, thinking, energy, stability, caring };
    const maxScore = Math.max(...Object.values(scores));

    if (scores.empathy === maxScore) return 'empathic_explorer';
    if (scores.thinking === maxScore) return 'thoughtful_thinker';
    if (scores.energy === maxScore) return 'energetic_driver';
    if (scores.stability === maxScore) return 'calm_stabilizer';
    return 'caring_supporter';
}

export default function ArchetypeResultScreen({ data, onComplete }) {
    const [archetypeKey, setArchetypeKey] = useState(null);

    useEffect(() => {
        const key = calculateArchetype(data);
        setArchetypeKey(key);

        // Confetti celebration
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#fb7185', '#c084fc', '#60a5fa']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#fb7185', '#c084fc', '#60a5fa']
            });

            requestAnimationFrame(frame);
        };

        frame();
    }, [data]);

    if (!archetypeKey) return null;

    const archetype = archetypes[archetypeKey];

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8 animate-fade-in">
                {/* Archetype Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                    {/* Emoji */}
                    <div className="text-center mb-6">
                        <div className="text-8xl mb-4 animate-bounce-slow">{archetype.emoji}</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            You're {archetype.name.startsWith('a') || archetype.name.startsWith('an') ? 'an' : 'a'} {archetype.name}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {archetype.description}
                        </p>
                    </div>

                    {/* Strengths */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            ✨ Your Strengths
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {archetype.strengths.map((strength, idx) => (
                                <div key={idx} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800">
                                    {strength}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Triggers */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            ⚠️ Your Emotional Triggers
                        </h3>
                        <div className="space-y-2">
                            {archetype.triggers.map((trigger, idx) => (
                                <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                                    {trigger}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Style */}
                    <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 border border-rose-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            💗 How Tara Will Support You
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {archetype.support}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => onComplete({ archetype: archetypeKey })}
                        className="w-full mt-8 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Start My Journey 🚀
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
