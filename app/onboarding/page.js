"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../lib/api";
import ProtectedRoute from "../components/ProtectedRoute";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faUserTag,
    faVenusMars,
    faCalendarAlt,
    faBriefcase,
    faHeart,
    faPalette,
    faArrowRight,
    faArrowLeft,
    faCheck
} from "@fortawesome/free-solid-svg-icons";

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading, checkAuth } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        nickname: "",
        gender: "",
        ageRange: "",
        profession: "",
        interests: [],
        personalityTraits: []
    });

    // Auto-fill user data from database
    useEffect(() => {
        if (user && !loading) {
            console.log('User data received:', user); // Debug log
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                nickname: user.nickname || user.name?.split(' ')[0] || "", // Use first name as default nickname
                // Keep other fields empty for user to fill
                gender: user.gender || "",
                ageRange: user.ageRange || "",
                profession: user.profession || "",
                interests: user.interests || [],
                personalityTraits: user.personalityTraits || []
            }));
        }
    }, [user, loading]);

    const professions = [
        "Student",
        "Working Professional",
        "Entrepreneur",
        "Freelancer",
        "Homemaker",
        "Retired",
        "Other"
    ];

    const interestOptions = [
        "Reading", "Music", "Sports", "Travel", "Cooking", "Photography",
        "Gaming", "Art", "Technology", "Fitness", "Movies", "Nature",
        "Fashion", "Science", "History", "Meditation"
    ];

    const personalityOptions = [
        "Introverted", "Extroverted", "Creative", "Analytical", "Empathetic",
        "Optimistic", "Adventurous", "Calm", "Energetic", "Thoughtful",
        "Ambitious", "Caring"
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayToggle = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Save onboarding data to database
            setSaving(true);
            try {
                // Check token before API call
                const token = localStorage.getItem('authToken');
                console.log('Token before onboarding API call:', token ? 'Present' : 'Missing');
                console.log('Onboarding data:', formData);

                const response = await api.put('/api/onboarding', formData);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Onboarding completed:', data);

                    // Refresh user data in AuthContext
                    await checkAuth();

                    // Small delay to ensure state update
                    setTimeout(() => {
                        router.push('/welcome');
                    }, 100);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to save onboarding data:', errorData);
                    // Still redirect but show error
                    router.push('/welcome');
                }
            } catch (error) {
                console.error('Error saving onboarding data:', error);
                // Still redirect but show error
                router.push('/welcome');
            } finally {
                setSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.name && formData.nickname && formData.gender && formData.ageRange;
            case 2:
                return formData.profession;
            case 3:
                return formData.interests.length > 0 && formData.personalityTraits.length > 0;
            default:
                return false;
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute requireOnboarding={false}>
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Image
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <span className="text-2xl font-bold text-rose-600">Tara</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Let's get to know you better
                        </h1>
                        <p className="text-gray-600">
                            Help us personalize your emotional wellness journey
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 3</span>
                            <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-rose-100 rounded-full h-2">
                            <div
                                className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl border border-rose-100 shadow-lg p-8">
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                                    <p className="text-gray-600">Tell us about yourself</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2 text-rose-500" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors outline-none"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUserTag} className="h-4 w-4 mr-2 text-rose-500" />
                                            Nickname
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nickname}
                                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors outline-none"
                                            placeholder="What should we call you?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faVenusMars} className="h-4 w-4 mr-2 text-rose-500" />
                                            Gender
                                        </label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors outline-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-rose-500" />
                                            Age Range
                                        </label>
                                        <select
                                            value={formData.ageRange}
                                            onChange={(e) => handleInputChange('ageRange', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors outline-none"
                                        >
                                            <option value="">Select age range</option>
                                            <option value="13-17">13-17</option>
                                            <option value="18-24">18-24</option>
                                            <option value="25-34">25-34</option>
                                            <option value="35-44">35-44</option>
                                            <option value="45-54">45-54</option>
                                            <option value="55-64">55-64</option>
                                            <option value="65+">65+</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Profession */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faBriefcase} className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Life</h2>
                                    <p className="text-gray-600">What do you do for work?</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4 mr-2 text-rose-500" />
                                        Profession
                                    </label>
                                    <select
                                        value={formData.profession}
                                        onChange={(e) => handleInputChange('profession', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors outline-none"
                                    >
                                        <option value="">Select your profession</option>
                                        {professions.map((profession) => (
                                            <option key={profession} value={profession}>
                                                {profession}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Interests & Personality */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faPalette} className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Interests & Personality</h2>
                                    <p className="text-gray-600">Help us understand what makes you unique</p>
                                </div>

                                {/* Interests */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-2 text-rose-500" />
                                        Interests (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {interestOptions.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => handleArrayToggle('interests', interest)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.interests.includes(interest)
                                                    ? 'bg-rose-200 text-rose-700 border-rose-200'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Personality Traits */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <FontAwesomeIcon icon={faPalette} className="h-4 w-4 mr-2 text-rose-500" />
                                        Personality Traits (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {personalityOptions.map((trait) => (
                                            <button
                                                key={trait}
                                                type="button"
                                                onClick={() => handleArrayToggle('personalityTraits', trait)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.personalityTraits.includes(trait)
                                                    ? 'bg-rose-200 text-rose-700 border-rose-200'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'
                                                    }`}
                                            >
                                                {trait}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                                Back
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!isStepValid() || saving}
                                className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${isStepValid() && !saving
                                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : currentStep === 3 ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                                        Complete Setup
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>


                </div>
            </div>


        </ProtectedRoute>
    );
}