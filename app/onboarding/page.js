'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';
import MoodSelectorScreen from '../components/onboarding/MoodSelectorScreen';
import PersonalityTestScreen from '../components/onboarding/PersonalityTestScreen';
import LifeAreasScreen from '../components/onboarding/LifeAreasScreen';
import SupportPreferenceScreen from '../components/onboarding/SupportPreferenceScreen';
import LoadingProfileScreen from '../components/onboarding/LoadingProfileScreen';
import ArchetypeResultScreen from '../components/onboarding/ArchetypeResultScreen';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [currentScreen, setCurrentScreen] = useState(0);
    const [onboardingData, setOnboardingData] = useState({
        currentMood: null,
        personalityAnswers: [],
        lifeAreas: [],
        supportPreference: null,
        archetype: null
    });

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    const handleNext = (data) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
        setCurrentScreen(prev => prev + 1);
    };

    const handleComplete = async (finalData) => {
        const completeData = { ...onboardingData, ...finalData };

        try {
            const response = await fetch('/api/onboarding/emotional/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeData)
            });

            if (response.ok) {
                router.push('/welcome');
            }
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
                <div className="animate-pulse text-rose-600 text-xl">Loading...</div>
            </div>
        );
    }

    const screens = [
        <WelcomeScreen key="welcome" onNext={() => handleNext({})} />,
        <MoodSelectorScreen key="mood" onNext={(mood) => handleNext({ currentMood: mood })} />,
        <PersonalityTestScreen key="personality" onNext={(answers) => handleNext({ personalityAnswers: answers })} />,
        <LifeAreasScreen key="life-areas" onNext={(areas) => handleNext({ lifeAreas: areas })} />,
        <SupportPreferenceScreen key="support" onNext={(pref) => handleNext({ supportPreference: pref })} />,
        <LoadingProfileScreen key="loading" onComplete={() => setCurrentScreen(prev => prev + 1)} />,
        <ArchetypeResultScreen key="result" data={onboardingData} onComplete={handleComplete} />
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
            {screens[currentScreen]}
        </div>
    );
}
