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
    const [currentStep, setCurrentStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "", nickname: "", gender: "", ageRange: "", profession: "",
        interests: [], personalityTraits: [], lifeAreas: []
    });
    const [showAddInterest, setShowAddInterest] = useState(false);
    const [showAddTrait, setShowAddTrait] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    const [newTrait, setNewTrait] = useState("");
    const [showAddLifeArea, setShowAddLifeArea] = useState(false);
    const [newLifeArea, setNewLifeArea] = useState("");

    useEffect(() => {
        if (user && !loading) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                nickname: user.nickname || user.name?.split(' ')[0] || "",
                gender: user.gender || "",
                ageRange: user.ageRange || "",
                profession: user.profession || "",
                interests: user.interests || [],
                personalityTraits: user.personalityTraits || [],
                lifeAreas: user.lifeAreas || []
            }));
        }
    }, [user, loading]);

    const professions = ["Student", "Working Professional", "Founder", "Freelancer", "Homemaker", "Retired", "Other"];

    const interestOptions = ["Reading", "Music", "Sports", "Travel", "Cooking", "Photography", "Gaming", "Art", "Technology", "Fitness", "Movies", "Nature", "Fashion", "Science", "History", "Meditation"];
    const personalityOptions = ["Introverted", "Extroverted", "Creative", "Analytical", "Empathetic", "Optimistic", "Adventurous", "Calm", "Energetic", "Thoughtful", "Ambitious", "Caring"];
    const lifeAreaOptions = ["Financial Growth", "Family", "Health", "Personal Growth", "Love & Relationships", "Career", "Social Life", "Spirituality"];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayToggle = (field, value) => {
        setFormData(prev => {
            const currentArray = prev[field];
            const isRemoving = currentArray.includes(value);
            if (field === 'lifeAreas' && !isRemoving && currentArray.length >= 8) {
                alert('You can select maximum 8 life areas');
                return prev;
            }
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

    const handleAddCustomTrait = () => {
        if (newTrait.trim() && !formData.personalityTraits.includes(newTrait.trim())) {
            setFormData(prev => ({ ...prev, personalityTraits: [...prev.personalityTraits, newTrait.trim()] }));
            setNewTrait("");
            setShowAddTrait(false);
        }
    };

    const handleAddCustomLifeArea = () => {
        if (newLifeArea.trim() && !formData.lifeAreas.includes(newLifeArea.trim())) {
            setFormData(prev => ({ ...prev, lifeAreas: [...prev.lifeAreas, newLifeArea.trim()] }));
            setNewLifeArea("");
            setShowAddLifeArea(false);
        }
    };

    const handleNext = async () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            setSaving(true);
            try {
                const response = await api.post('/api/onboarding', formData);
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
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return formData.name && formData.nickname && formData.gender && formData.ageRange;
            case 2: return formData.profession;
            case 3: return formData.interests.length > 0 && formData.personalityTraits.length > 0;
            case 4: return formData.lifeAreas.length >= 4 && formData.lifeAreas.length <= 8;
            default: return false;
        }
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-600" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Image src="/taralogo.jpg" alt="Tara Logo" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                            <span className="text-2xl font-bold text-rose-600">Tara</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's get to know you better</h1>
                        <p className="text-gray-600">Help us personalize your emotional wellness journey</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
                            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-rose-100 rounded-full h-2">
                            <div className="bg-rose-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-rose-100 shadow-lg p-8">
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
                                            <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2 text-rose-500" />Full Name
                                        </label>
                                        <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors outline-none" placeholder="Enter your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faUserTag} className="h-4 w-4 mr-2 text-rose-500" />Nickname
                                        </label>
                                        <input type="text" value={formData.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors outline-none" placeholder="What should we call you?" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faVenusMars} className="h-4 w-4 mr-2 text-rose-500" />Gender
                                        </label>
                                        <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors outline-none">
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2 text-rose-500" />Age Range
                                        </label>
                                        <select value={formData.ageRange} onChange={(e) => handleInputChange('ageRange', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors outline-none">
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
                                        <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4 mr-2 text-rose-500" />Profession
                                    </label>
                                    <select value={formData.profession} onChange={(e) => handleInputChange('profession', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors outline-none">
                                        <option value="">Select your profession</option>
                                        {professions.map((profession) => (
                                            <option key={profession} value={profession}>{profession}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faPalette} className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Interests & Personality</h2>
                                    <p className="text-gray-600">Help us understand what makes you unique</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <FontAwesomeIcon icon={faHeart} className="h-4 w-4 mr-2 text-rose-500" />Interests (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {interestOptions.map((interest) => (
                                            <button key={interest} type="button" onClick={() => handleArrayToggle('interests', interest)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.interests.includes(interest) ? 'bg-rose-200 text-rose-600 border-rose-200' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'}`}>
                                                {interest}
                                            </button>
                                        ))}
                                        {formData.interests.filter(i => !interestOptions.includes(i)).map((interest) => (
                                            <button key={interest} type="button" onClick={() => handleArrayToggle('interests', interest)} className="px-4 py-2 rounded-lg border text-sm font-medium transition-all bg-rose-200 text-rose-600 border-rose-200">
                                                {interest}
                                            </button>
                                        ))}
                                        {!showAddInterest ? (
                                            <button type="button" onClick={() => setShowAddInterest(true)} className="px-4 py-2 rounded-lg border-2 border-dashed border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-all">
                                                + Add More
                                            </button>
                                        ) : (
                                            <div className="col-span-2 md:col-span-4 flex gap-2">
                                                <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()} placeholder="Type your interest..." className="flex-1 px-4 py-2 border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-200" autoFocus />
                                                <button type="button" onClick={handleAddCustomInterest} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">Add</button>
                                                <button type="button" onClick={() => { setShowAddInterest(false); setNewInterest(""); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <FontAwesomeIcon icon={faPalette} className="h-4 w-4 mr-2 text-rose-500" />Personality Traits (Select multiple)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {personalityOptions.map((trait) => (
                                            <button key={trait} type="button" onClick={() => handleArrayToggle('personalityTraits', trait)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.personalityTraits.includes(trait) ? 'bg-rose-200 text-rose-600 border-rose-200' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'}`}>
                                                {trait}
                                            </button>
                                        ))}
                                        {formData.personalityTraits.filter(t => !personalityOptions.includes(t)).map((trait) => (
                                            <button key={trait} type="button" onClick={() => handleArrayToggle('personalityTraits', trait)} className="px-4 py-2 rounded-lg border text-sm font-medium transition-all bg-rose-200 text-rose-600 border-rose-200">
                                                {trait}
                                            </button>
                                        ))}
                                        {!showAddTrait ? (
                                            <button type="button" onClick={() => setShowAddTrait(true)} className="px-4 py-2 rounded-lg border-2 border-dashed border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-all">
                                                + Add More
                                            </button>
                                        ) : (
                                            <div className="col-span-2 md:col-span-4 flex gap-2">
                                                <input type="text" value={newTrait} onChange={(e) => setNewTrait(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTrait()} placeholder="Type your personality trait..." className="flex-1 px-4 py-2 border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-200" autoFocus />
                                                <button type="button" onClick={handleAddCustomTrait} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">Add</button>
                                                <button type="button" onClick={() => { setShowAddTrait(false); setNewTrait(""); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                                        <FontAwesomeIcon icon={faChartPie} className="h-8 w-8 text-rose-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Life Areas That Matter</h2>
                                    <p className="text-gray-600">Select areas important for your mental & emotional health</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        <FontAwesomeIcon icon={faChartPie} className="h-4 w-4 mr-2 text-rose-500" />
                                        Select Your Focus Areas (Minimum 4, Maximum 8)
                                        <span className="ml-2 text-xs text-rose-600 font-semibold">{formData.lifeAreas.length}/8 selected</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {lifeAreaOptions.map((area) => (
                                            <button key={area} type="button" onClick={() => handleArrayToggle('lifeAreas', area)} className={`px-6 py-4 rounded-lg border text-sm font-medium transition-all text-left ${formData.lifeAreas.includes(area) ? 'bg-rose-200 text-rose-600 border-rose-200 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'}`}>
                                                {area}
                                            </button>
                                        ))}
                                        {formData.lifeAreas.filter(a => !lifeAreaOptions.includes(a)).map((area) => (
                                            <button key={area} type="button" onClick={() => handleArrayToggle('lifeAreas', area)} className="px-6 py-4 rounded-lg border text-sm font-medium transition-all text-left bg-rose-200 text-rose-600 border-rose-200 shadow-md">
                                                {area}
                                            </button>
                                        ))}
                                        {!showAddLifeArea ? (
                                            <button type="button" onClick={() => setShowAddLifeArea(true)} className="px-6 py-4 rounded-lg border-2 border-dashed border-rose-300 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-all">
                                                + Add Other
                                            </button>
                                        ) : (
                                            <div className="col-span-1 md:col-span-2 flex gap-2">
                                                <input type="text" value={newLifeArea} onChange={(e) => setNewLifeArea(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCustomLifeArea()} placeholder="Type your life area..." className="flex-1 px-4 py-2 border border-rose-300 rounded-lg outline-none focus:ring-2 focus:ring-rose-200" autoFocus />
                                                <button type="button" onClick={handleAddCustomLifeArea} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">Add</button>
                                                <button type="button" onClick={() => { setShowAddLifeArea(false); setNewLifeArea(""); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                            <button onClick={handleBack} disabled={currentStep === 1} className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />Back
                            </button>
                            <button onClick={handleNext} disabled={!isStepValid() || saving} className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${isStepValid() && !saving ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : currentStep === 4 ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />Complete Setup
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
        </div>
    );
}
