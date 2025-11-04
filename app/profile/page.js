"use client";
import { useState, useEffect } from "react";
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
    faEdit,
    faSave,
    faTimes,
    faArrowLeft,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "",
        nickname: "",
        gender: "",
        ageRange: "",
        profession: "",
        interests: [],
        personalityTraits: []
    });
    const [editData, setEditData] = useState({});

    const professions = [
        "Student", "Software Developer", "Teacher", "Doctor", "Engineer",
        "Designer", "Marketing Manager", "Sales Representative", "Entrepreneur",
        "Consultant", "Writer", "Artist", "Nurse", "Lawyer", "Accountant",
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

    useEffect(() => {
        // Load user profile from localStorage
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            setEditData(profile);
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...userProfile });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...userProfile });
    };

    const handleSave = () => {
        setUserProfile(editData);
        localStorage.setItem('userProfile', JSON.stringify(editData));
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayToggle = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50">
            {/* Header */}
            <header className="bg-white border-b border-rose-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">

                            <div className="flex items-center gap-3">
                                <Image
                                    src="/taralogo.jpg"
                                    alt="Tara Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <span className="text-xl font-bold text-red-400">Profile</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem('userProfile');
                                localStorage.removeItem('isNewUser');
                                window.location.href = '/';
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl border border-rose-100 shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-red-100 to-rose-100 px-8 py-12 text-gray-800">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="h-12 w-12" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {userProfile.name || "Your Name"}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    @{userProfile.nickname || "nickname"}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    {userProfile.profession || "Profession"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-red-400" />
                                    Basic Information
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-300 transition-colors outline-none"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                            {userProfile.name || "Not provided"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.nickname}
                                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-300 transition-colors outline-none"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                            {userProfile.nickname || "Not provided"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.gender}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-300 transition-colors outline-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="non-binary">Non-binary</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                                            {userProfile.gender || "Not provided"}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.ageRange}
                                            onChange={(e) => handleInputChange('ageRange', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-300 transition-colors outline-none"
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
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                            {userProfile.ageRange || "Not provided"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5 text-red-400" />
                                    Professional Information
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                                {isEditing ? (
                                    <select
                                        value={editData.profession}
                                        onChange={(e) => handleInputChange('profession', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-300 transition-colors outline-none"
                                    >
                                        <option value="">Select profession</option>
                                        {professions.map((profession) => (
                                            <option key={profession} value={profession}>
                                                {profession}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                        {userProfile.profession || "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-red-400" />
                                    Interests
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {interestOptions.map((interest) => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => handleArrayToggle('interests', interest)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${editData.interests.includes(interest)
                                                ? 'bg-red-100 text-red-600 border-red-200'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-red-200'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.interests.length > 0 ? (
                                        userProfile.interests.map((interest) => (
                                            <span
                                                key={interest}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
                                            >
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No interests added</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Personality Traits */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-red-400" />
                                    Personality Traits
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCancel}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
                                            Save
                                        </button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {personalityOptions.map((trait) => (
                                        <button
                                            key={trait}
                                            type="button"
                                            onClick={() => handleArrayToggle('personalityTraits', trait)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${editData.personalityTraits.includes(trait)
                                                ? 'bg-red-100 text-red-600 border-red-200'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-red-200'
                                                }`}
                                        >
                                            {trait}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.personalityTraits.length > 0 ? (
                                        userProfile.personalityTraits.map((trait) => (
                                            <span
                                                key={trait}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
                                            >
                                                {trait}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic">No personality traits added</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}