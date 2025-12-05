"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../lib/api";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faUserTag, faVenusMars, faCalendarAlt, faBriefcase,
    faHeart, faPalette, faArrowRight, faArrowLeft, faCheck, faChartPie, faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
    const router = useRouter();
    const { user, loading, checkAuth } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [saving, setSaving] = useState(false);

    // Fixed 8 life areas for all users
    const FIXED_LIFE_AREAS = [
        "Financial Growth",
        "Family",
        "Health",
        "Personal Growth",
        "Love & Relationships",
        "Career",
        "Social Life",
        "Spirituality"
    ];

    // Reasons for using Tara
    const REASONS_FOR_USING = [
        "Feeling stressed or anxious",
        "Need someone to talk to",
        "Want to improve mental health",
        "Looking for emotional support",
        "Dealing with depression or low mood",
        "Managing work-life balance",
        "Relationship issues",
        "Personal growth and self-improvement",
        "Sleep problems",
        "Loneliness",
        "Just curious to try"
    ];

    const [formData, setFormData] = useState({
        reasonForUsing: [],
        name: "", nickname: "", gender: "", ageRange: "", profession: "",
        interests: [], personalityTraits: [], lifeAreas: FIXED_LIFE_AREAS,
        // Emotional onboarding fields
        currentMood: null,
        personalityAnswers: [],
        supportPreference: null,
        archetype: null
    });
    const [showAddInterest, setShowAddInterest] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState(2); // Default to middle value

    useEffect(() => {
        if (user && !loading) {
            setFormData(prev => ({
                ...prev,
                reasonForUsing: Array.isArray(user.reasonForUsing) ? user.reasonForUsing : (user.reasonForUsing ? [user.reasonForUsing] : []),
                name: user.name || "",
                nickname: user.nickname || user.name?.split(' ')[0] || "",
                gender: user.gender || "",
                ageRange: user.ageRange || "",
                profession: user.profession || "",
                interests: user.interests || [],
                personalityTraits: user.personalityTraits || [],
                lifeAreas: FIXED_LIFE_AREAS // Always use fixed life areas
            }));
        }
    }, [user, loading]);

    const professions = ["Student", "Working Professional", "Founder", "Freelancer", "Homemaker", "Retired", "Other"];

    const interestOptions = ["Reading", "Music", "Sports", "Travel", "Cooking", "Photography", "Gaming", "Art", "Technology", "Fitness", "Movies", "Nature", "Fashion", "Science", "History", "Meditation"];
    const personalityOptions = ["Introverted", "Extroverted", "Creative", "Analytical", "Empathetic", "Optimistic", "Adventurous", "Calm", "Energetic", "Thoughtful", "Ambitious", "Caring"];

    // Emotional onboarding data
    const moods = [
        { emoji: '🙂', label: 'Calm', value: 'calm' },
        { emoji: '😐', label: 'Okay', value: 'okay' },
        { emoji: '😔', label: 'Low', value: 'low' },
        { emoji: '😣', label: 'Stressed', value: 'stressed' },
        { emoji: '😡', label: 'Irritated', value: 'irritated' },
        { emoji: '😭', label: 'Overwhelmed', value: 'overwhelmed' }
    ];

    const personalityQuestions = [
        { id: 1, text: "I understand my emotions well.", category: "emotional_awareness" },
        { id: 2, text: "I stay calm under pressure.", category: "emotional_stability" },
        { id: 3, text: "I bounce back quickly from setbacks.", category: "resilience" },
        { id: 4, text: "I can sense others' feelings easily.", category: "empathy" },
        { id: 5, text: "I express my feelings clearly.", category: "communication" },
        { id: 6, text: "I tend to avoid conflict.", category: "conflict_style" },
        { id: 7, text: "Talking to people energizes me.", category: "extraversion" },
        { id: 8, text: "I like routines and structure.", category: "conscientiousness" },
        { id: 9, text: "I stick to my goals consistently.", category: "conscientiousness" },
        { id: 10, text: "I enjoy exploring new ideas and emotions.", category: "openness" },
        { id: 11, text: "I often worry about things.", category: "neuroticism" },
        { id: 12, text: "I prefer deep conversations over small talk.", category: "openness" }
    ];

    const supportPreferences = [
        { id: 'calming_voice', icon: '🎵', title: 'A calming voice', description: 'Soothing words to ease your mind' },
        { id: 'problem_solving', icon: '🧩', title: 'Simple steps to solve the problem', description: 'Practical solutions and action plans' },
        { id: 'express_feelings', icon: '💭', title: 'A space to express feelings', description: 'Safe place to share what you feel' },
        { id: 'quick_motivation', icon: '⚡', title: 'Quick motivation', description: 'Energizing boost when you need it' },
        { id: 'deep_insights', icon: '🔮', title: 'Deep emotional insights', description: 'Understanding the why behind emotions' }
    ];

    const sliderLabels = ['😔', '😐', '🙂', '😊', '😄'];

    // Calculate archetype based on answers
    const calculateArchetype = () => {
        const answers = formData.personalityAnswers;
        let empathy = 0, thinking = 0, energy = 0, stability = 0, caring = 0;

        answers.forEach(answer => {
            if (answer.questionId === 4) empathy += answer.value;
            if (answer.questionId === 1) empathy += answer.value;
            if ([2, 8].includes(answer.questionId)) stability += answer.value;
            if ([9, 7].includes(answer.questionId)) energy += answer.value;
            if ([10, 12].includes(answer.questionId)) thinking += answer.value;
        });

        if (formData.lifeAreas.includes('Love & Relationships') || formData.lifeAreas.includes('Family')) caring += 2;
        if (formData.supportPreference === 'deep_insights') empathy += 2;
        if (formData.supportPreference === 'problem_solving') thinking += 2;
        if (formData.supportPreference === 'quick_motivation') energy += 2;
        if (formData.supportPreference === 'calming_voice') stability += 2;
        if (formData.supportPreference === 'express_feelings') caring += 2;

        const scores = { empathy, thinking, energy, stability, caring };
        const maxScore = Math.max(...Object.values(scores));

        if (scores.empathy === maxScore) return 'empathic_explorer';
        if (scores.thinking === maxScore) return 'thoughtful_thinker';
        if (scores.energy === maxScore) return 'energetic_driver';
        if (scores.stability === maxScore) return 'calm_stabilizer';
        return 'caring_supporter';
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayToggle = (field, value) => {
        setFormData(prev => {
            const currentArray = prev[field];
            const isRemoving = currentArray.includes(value);
            return {
                ...prev,
                [field]: isRemoving ? currentArray.filter(item => item !== value) : [...currentArray, value]
            };
        });
    };

    const handleAddCustomInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData(prev => ({ ...prev, interests: [...prev.interests, newInterest.trim()] }));
            setNewInterest("");
            setShowAddInterest(false);
        }
    };

    const handleMoodSelect = (mood) => {
        setFormData(prev => ({ ...prev, currentMood: mood }));
        setTimeout(() => setCurrentStep(5), 300);
    };

    const handlePersonalityAnswer = () => {
        const newAnswers = [...formData.personalityAnswers, {
            questionId: personalityQuestions[currentQuestion].id,
            value: currentAnswer
        }];
        setFormData(prev => ({ ...prev, personalityAnswers: newAnswers }));

        if (currentQuestion < personalityQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setCurrentAnswer(2);
        } else {
            setCurrentStep(5);
            setCurrentQuestion(0);
        }
    };

    const generateAboutMe = (answers) => {
        // Analyze personality based on answers
        let traits = [];

        // Emotional awareness (Q1)
        const q1 = answers.find(a => a.questionId === 1)?.value || 2;
        if (q1 >= 3) traits.push("self-aware");

        // Emotional stability (Q2)
        const q2 = answers.find(a => a.questionId === 2)?.value || 2;
        if (q2 >= 3) traits.push("calm under pressure");

        // Resilience (Q3)
        const q3 = answers.find(a => a.questionId === 3)?.value || 2;
        if (q3 >= 3) traits.push("resilient");

        // Empathy (Q4)
        const q4 = answers.find(a => a.questionId === 4)?.value || 2;
        if (q4 >= 3) traits.push("empathetic");

        // Communication (Q5)
        const q5 = answers.find(a => a.questionId === 5)?.value || 2;
        if (q5 >= 3) traits.push("expressive");

        // Conflict style (Q6)
        const q6 = answers.find(a => a.questionId === 6)?.value || 2;
        if (q6 >= 3) traits.push("peace-loving");
        else if (q6 <= 1) traits.push("direct");

        // Extraversion (Q7)
        const q7 = answers.find(a => a.questionId === 7)?.value || 2;
        if (q7 >= 3) traits.push("social");
        else if (q7 <= 1) traits.push("introspective");

        // Conscientiousness (Q8, Q9)
        const q8 = answers.find(a => a.questionId === 8)?.value || 2;
        const q9 = answers.find(a => a.questionId === 9)?.value || 2;
        if ((q8 + q9) / 2 >= 3) traits.push("organized and goal-oriented");

        // Openness (Q10, Q12)
        const q10 = answers.find(a => a.questionId === 10)?.value || 2;
        const q12 = answers.find(a => a.questionId === 12)?.value || 2;
        if ((q10 + q12) / 2 >= 3) traits.push("curious and thoughtful");

        // Neuroticism (Q11)
        const q11 = answers.find(a => a.questionId === 11)?.value || 2;
        if (q11 <= 1) traits.push("emotionally stable");

        // Build about me text
        const profession = formData.profession || "professional";
        const interests = formData.interests.slice(0, 3).join(", ") || "various interests";
        const reasons = formData.reasonForUsing.slice(0, 2).join(" and ") || "personal growth";

        let aboutMe = `I'm a ${profession.toLowerCase()} who is ${traits.slice(0, 3).join(", ")}. `;
        aboutMe += `I enjoy ${interests} and I'm here to work on ${reasons.toLowerCase()}. `;

        if (traits.length > 3) {
            aboutMe += `I value ${traits.slice(3, 5).join(" and ")}, `;
        }

        aboutMe += `and I'm committed to my personal growth and well-being.`;

        // Ensure it's under 100 words
        const words = aboutMe.split(' ');
        if (words.length > 100) {
            aboutMe = words.slice(0, 100).join(' ') + '...';
        }

        return aboutMe;
    };

    const handleSupportSelect = (prefId) => {
        const archetype = calculateArchetype();
        setFormData(prev => ({
            ...prev,
            supportPreference: prefId,
            archetype: archetype
        }));
    };

    const handleNext = async () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else {
            setSaving(true);
            try {
                // Generate about me text based on personality answers
                const aboutMe = generateAboutMe(formData.personalityAnswers);

                // Ensure fixed life areas are always included
                const dataToSave = {
                    ...formData,
                    lifeAreas: FIXED_LIFE_AREAS,
                    aboutMe: aboutMe
                };

                const response = await api.post('/api/onboarding', dataToSave);
                if (response.ok) {
                    await checkAuth();

                    // Check if there's a redirect URL stored
                    const redirectUrl = localStorage.getItem('redirectAfterLogin');

                    if (onComplete) {
                        onComplete();
                    } else if (redirectUrl && redirectUrl !== '/') {
                        // If there's a stored redirect URL and no custom callback, redirect there
                        localStorage.removeItem('redirectAfterLogin');
                        router.push(redirectUrl);
                    } else {
                        router.push('/welcome');
                    }

                    onClose();
                }
            } catch (error) {
                console.error('Error saving onboarding data:', error);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return formData.reasonForUsing.length > 0;
            case 1: return formData.name && formData.nickname && formData.gender && formData.ageRange;
            case 2: return formData.profession;
            case 3: return formData.interests.length > 0;
            case 4: return formData.personalityAnswers.length === 12;
            case 5: return formData.supportPreference !== null;
            default: return false;
        }
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-[96vw] sm:max-w-lg lg:max-w-2xl bg-white rounded-xl sm:rounded-3xl shadow-2xl max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600" />
                </button>

                <div className="p-3 sm:p-6 lg:p-8">
                    <div className="text-center mb-3 sm:mb-6">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                            <Image src="/taralogo.jpg" alt="Tara Logo" width={32} height={32} className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover" />
                            <span className="text-lg sm:text-2xl font-bold text-rose-600">Tara</span>
                        </div>
                        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome to Tara! 👋</h1>
                        <p className="text-xs sm:text-base text-gray-600 hidden sm:block">Let's set up your profile to personalize your wellness journey</p>
                    </div>

                    <div className="mb-3 sm:mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-gray-600">Step {currentStep + 1} of 6</span>
                            <span className="text-xs text-gray-500">{Math.round(((currentStep + 1) / 6) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-rose-100 rounded-full h-1.5 sm:h-2">
                            <div className="bg-rose-500 h-1.5 sm:h-2 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / 6) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg sm:rounded-2xl border border-rose-100 shadow-lg p-3 sm:p-6 lg:p-8">
                        {currentStep === 0 && (
                            <div className="space-y-3 sm:space-y-6">
                                <div className="text-center mb-3 sm:mb-6">
                                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-rose-100 rounded-full mb-2 sm:mb-4">
                                        <FontAwesomeIcon icon={faHeart} className="h-5 w-5 sm:h-8 sm:w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">What brings you here today?</h2>
                                    <p className="text-xs sm:text-base text-gray-600 hidden sm:block">Help us understand how we can support you better</p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-rose-500" />
                                            Select all that apply
                                        </label>
                                        {formData.reasonForUsing.length > 0 && (
                                            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                                                {formData.reasonForUsing.length} selected
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                        {REASONS_FOR_USING.map((reason) => {
                                            const isSelected = formData.reasonForUsing.includes(reason);
                                            return (
                                                <button
                                                    key={reason}
                                                    type="button"
                                                    onClick={() => handleArrayToggle('reasonForUsing', reason)}
                                                    className={`px-2.5 py-2 sm:px-4 sm:py-3 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all text-left ${isSelected
                                                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{reason}</span>
                                                        {isSelected && (
                                                            <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {formData.reasonForUsing.length > 0 && (
                                        <div className="mt-2 sm:mt-4 p-2.5 sm:p-4 bg-rose-50 rounded-lg border border-rose-200">
                                            <p className="text-xs sm:text-sm text-gray-700">
                                                <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-rose-600" />
                                                Great! We'll personalize your experience
                                            </p>
                                            <ul className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                                                {formData.reasonForUsing.slice(0, 3).map((reason, idx) => (
                                                    <li key={idx} className="text-xs sm:text-sm text-rose-600 font-semibold ml-4 sm:ml-6">
                                                        • {reason}
                                                    </li>
                                                ))}
                                                {formData.reasonForUsing.length > 3 && (
                                                    <li className="text-xs sm:text-sm text-rose-600 font-semibold ml-4 sm:ml-6">
                                                        + {formData.reasonForUsing.length - 3} more
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-2.5 sm:space-y-4">
                                <div className="text-center mb-2 sm:mb-4">
                                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-rose-100 rounded-full mb-1.5 sm:mb-3">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 sm:h-7 sm:w-7 text-rose-600" />
                                    </div>
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">Basic Information</h2>
                                    <p className="text-xs text-gray-600 hidden sm:block">Tell us about yourself</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <FontAwesomeIcon icon={faUser} className="h-3 w-3 mr-1 text-rose-500" />Full Name
                                        </label>
                                        <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg transition-colors outline-none" placeholder="Enter your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <FontAwesomeIcon icon={faUserTag} className="h-3 w-3 mr-1 text-rose-500" />Nickname
                                        </label>
                                        <input type="text" value={formData.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} className="w-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg transition-colors outline-none" placeholder="What should we call you?" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <FontAwesomeIcon icon={faVenusMars} className="h-3 w-3 mr-1 text-rose-500" />Gender
                                        </label>
                                        <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg transition-colors outline-none">
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1 text-rose-500" />Age Range
                                        </label>
                                        <select value={formData.ageRange} onChange={(e) => handleInputChange('ageRange', e.target.value)} className="w-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg transition-colors outline-none">
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


                        {currentStep === 2 && (
                            <div className="space-y-2.5 sm:space-y-4">
                                <div className="text-center mb-2 sm:mb-4">
                                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-rose-100 rounded-full mb-1.5 sm:mb-3">
                                        <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5 sm:h-7 sm:w-7 text-rose-600" />
                                    </div>
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">Professional Life</h2>
                                    <p className="text-xs text-gray-600 hidden sm:block">What do you do for work?</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        <FontAwesomeIcon icon={faBriefcase} className="h-3 w-3 mr-1 text-rose-500" />Profession
                                    </label>
                                    <select value={formData.profession} onChange={(e) => handleInputChange('profession', e.target.value)} className="w-full px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg transition-colors outline-none">
                                        <option value="">Select your profession</option>
                                        {professions.map((profession) => (
                                            <option key={profession} value={profession}>{profession}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-2.5 sm:space-y-4">
                                <div className="text-center mb-2 sm:mb-4">
                                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 bg-rose-100 rounded-full mb-1.5 sm:mb-3">
                                        <FontAwesomeIcon icon={faPalette} className="h-5 w-5 sm:h-7 sm:w-7 text-rose-600" />
                                    </div>
                                    <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">Your Interests</h2>
                                    <p className="text-xs text-gray-600 hidden sm:block">Help us understand what you enjoy</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-3">
                                        <FontAwesomeIcon icon={faHeart} className="h-3 w-3 mr-1 text-rose-500" />Interests (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3">
                                        {interestOptions.map((interest) => (
                                            <button key={interest} type="button" onClick={() => handleArrayToggle('interests', interest)} className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border text-xs font-medium transition-all ${formData.interests.includes(interest) ? 'bg-rose-200 text-rose-600 border-rose-200' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'}`}>
                                                {interest}
                                            </button>
                                        ))}
                                        {formData.interests.filter(i => !interestOptions.includes(i)).map((interest) => (
                                            <button key={interest} type="button" onClick={() => handleArrayToggle('interests', interest)} className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all bg-rose-200 text-rose-600 border-rose-200">
                                                {interest}
                                            </button>
                                        ))}
                                        {!showAddInterest ? (
                                            <button type="button" onClick={() => setShowAddInterest(true)} className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border-2 border-dashed border-rose-300 text-rose-600 text-xs sm:text-sm font-medium hover:bg-rose-50 transition-all">
                                                + Add More
                                            </button>
                                        ) : (
                                            <div className="col-span-2 md:col-span-4 flex gap-2">
                                                <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()} placeholder="Type your interest..." className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-200" autoFocus />
                                                <button type="button" onClick={handleAddCustomInterest} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">Add</button>
                                                <button type="button" onClick={() => { setShowAddInterest(false); setNewInterest(""); }} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-2.5 sm:space-y-4">
                                <div className="mb-2 sm:mb-4">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                                        <span>Question {currentQuestion + 1} of {personalityQuestions.length}</span>
                                        <span>{Math.round(((currentQuestion + 1) / personalityQuestions.length) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
                                            style={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="text-center mb-3 sm:mb-6">
                                    <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                                        {personalityQuestions[currentQuestion].text}
                                    </h3>
                                </div>

                                <div className="space-y-2.5 sm:space-y-4">
                                    <div className="flex justify-between items-center px-0.5 sm:px-2">
                                        {sliderLabels.map((label, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentAnswer(idx)}
                                                className={`text-xl sm:text-3xl lg:text-4xl transition-all ${currentAnswer === idx ? 'scale-110 sm:scale-125' : 'scale-100 opacity-50'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="4"
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #fb7185 0%, #fb7185 ${(currentAnswer / 4) * 100}%, #e5e7eb ${(currentAnswer / 4) * 100}%, #e5e7eb 100%)`
                                        }}
                                    />

                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Strongly Disagree</span>
                                        <span>Strongly Agree</span>
                                    </div>

                                    <button
                                        onClick={handlePersonalityAnswer}
                                        className="w-full mt-2 sm:mt-3 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-5 py-2 sm:px-8 sm:py-3 rounded-full text-xs sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        {currentQuestion < personalityQuestions.length - 1 ? 'Next Question' : 'Continue'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="space-y-2.5 sm:space-y-4">
                                <div className="text-center mb-2 sm:mb-4">
                                    <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">When you're upset, what helps you most?</h2>
                                    <p className="text-xs text-gray-600 hidden sm:block">Choose the support style that resonates with you</p>
                                </div>
                                <div className="space-y-1.5 sm:space-y-3">
                                    {supportPreferences.map((pref) => (
                                        <button
                                            key={pref.id}
                                            onClick={() => handleSupportSelect(pref.id)}
                                            className={`w-full p-2.5 sm:p-4 lg:p-5 rounded-lg sm:rounded-2xl border-2 transition-all hover:scale-102 active:scale-98 text-left ${formData.supportPreference === pref.id
                                                ? 'border-rose-500 bg-rose-50 shadow-lg'
                                                : 'border-gray-200 bg-white hover:border-rose-300'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="text-2xl sm:text-4xl flex-shrink-0">{pref.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="text-xs sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">{pref.title}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">{pref.description}</p>
                                                </div>
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.supportPreference === pref.id
                                                    ? 'border-rose-500 bg-rose-500'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {formData.supportPreference === pref.id && (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-gray-200">
                            <button onClick={handleBack} disabled={currentStep === 0} className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-base font-medium transition-all ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3 sm:h-4 sm:w-4" />Back
                            </button>
                            <button onClick={handleNext} disabled={!isStepValid() || saving} className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-base font-semibold transition-all ${isStepValid() && !saving ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                {saving ? (
                                    <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : currentStep === 5 ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4" />Complete Setup
                                    </>
                                ) : currentStep === 4 ? (
                                    <>Continue</>
                                ) : (
                                    <>
                                        Next
                                        <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
