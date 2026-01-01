'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/api';

const archetypeEmojis = {
    empathic_explorer: '🌸',
    thoughtful_thinker: '🧠',
    energetic_driver: '⚡',
    calm_stabilizer: '🌊',
    caring_supporter: '💝'
};

const archetypeNames = {
    empathic_explorer: 'Empathic Explorer',
    thoughtful_thinker: 'Thoughtful Thinker',
    energetic_driver: 'Energetic Driver',
    calm_stabilizer: 'Calm Stabilizer',
    caring_supporter: 'Caring Supporter'
};

const lifeAreaLabels = {
    relationship: '❤️ Relationship',
    family: '🏠 Family',
    work: '💼 Work',
    financial: '💰 Financial',
    mental: '🧠 Mental wellbeing',
    health: '💪 Health',
    self_growth: '🧘 Self-growth'
};

export default function OnboardingProfileCard() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/onboarding/emotional/status`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        );
    }

    if (!profile || !profile.onboardingCompleted) {
        return (
            <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Complete Your Profile
                </h3>
                <p className="text-gray-700 mb-4">
                    Take a minute to personalize your Tara experience
                </p>
                <a
                    href="/onboarding"
                    className="inline-block bg-gradient-to-r from-rose-400 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                    Start Onboarding ✨
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {/* Archetype */}
            <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">
                    {archetypeEmojis[profile.archetype]}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {archetypeNames[profile.archetype]}
                    </h3>
                    <p className="text-sm text-gray-600">Your Emotional Archetype</p>
                </div>
            </div>

            {/* Life Areas */}
            {profile.lifeAreas && profile.lifeAreas.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Focus Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.lifeAreas.map((area) => (
                            <span
                                key={area}
                                className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-sm"
                            >
                                {lifeAreaLabels[area]}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Support Preference */}
            {profile.supportPreference && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Support Style
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                        {profile.supportPreference.replace(/_/g, ' ')}
                    </p>
                </div>
            )}

            {/* Retake Button */}
            <a
                href="/onboarding"
                className="block text-center text-sm text-rose-600 hover:text-rose-700 font-medium mt-4 underline"
            >
                Retake Assessment
            </a>
        </div>
    );
}
