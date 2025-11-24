"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNav from "../components/BottomNav";
import ThemeSelector from "../components/ThemeSelector";
import ProfileCompletionCircle from "../components/ProfileCompletionCircle";
import {
    faUser,
    faEdit,
    faSave,
    faTimes,
    faSignOutAlt,
    faChartLine,
    faBookOpen,
    faComments,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faBriefcase,
    faHeart,
    faPalette,
    faCalendarAlt,
    faClock,
    faFire,
    faJournalWhills,
    faLightbulb,
    faBullseye,
    faShieldAlt,
    faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading, updateUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "",
        nickname: "",
        email: "",
        phone: "",
        location: "",
        profession: "",
        bio: "",
        interests: [],
        personalityTraits: [],
        gender: "",
        ageRange: "",
        joinedDate: ""
    });
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState([
        { label: "Journal Entries", value: "0", icon: faBookOpen, color: "text-green-500" },
        { label: "Active Goals", value: "0", icon: faBullseye, color: "text-blue-500" },
        { label: "Completed Goals", value: "0", icon: faFire, color: "text-orange-500" },
        { label: "Mood Check-ins", value: "0", icon: faHeart, color: "text-purple-500" }
    ]);

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

    // Load user data from database
    useEffect(() => {
        if (user && !loading) {
            const profile = {
                name: user.name || "",
                nickname: user.nickname || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
                profession: user.profession || "",
                bio: user.bio || "",
                interests: user.interests || [],
                personalityTraits: user.personalityTraits || [],
                gender: user.gender || "",
                ageRange: user.ageRange || "",
                joinedDate: user.createdAt || ""
            };
            setUserProfile(profile);
            setEditData(profile);
        }
    }, [user, loading]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...userProfile });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...userProfile });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update profile in database
            const response = await api.post('/api/onboarding', editData);

            if (response.ok) {
                const data = await response.json();
                setUserProfile(editData);
                setIsEditing(false);
                console.log('Profile updated successfully:', data);
            } else {
                const errorData = await response.json();
                console.error('Failed to update profile:', errorData);
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setSaving(false);
        }
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
            [field]: prev[field]?.includes(value)
                ? prev[field].filter(item => item !== value)
                : [...(prev[field] || []), value]
        }));
    };

    const handleLogout = async () => {
        try {
            console.log('Logging out...');

            // Use AuthContext logout function
            await logout();
            console.log('Logout successful');

            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback - still clear localStorage and redirect
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    };

    // Show loading while user data is being fetched
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-main)' }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col" style={{ background: 'var(--gradient-main)' }}>
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeSelector />
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${saving
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                        }`}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden">
                            <div className="px-6 py-8" style={{ background: 'var(--gradient-header)' }}>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <ProfileCompletionCircle size="lg" showPercentage={true} />
                                    </div>
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="text-2xl font-bold bg-white/90 rounded-lg px-3 py-2 border border-rose-200 focus:border-rose-300 outline-none w-full"
                                                placeholder="Your Name"
                                            />
                                        ) : (
                                            <h1 className="text-2xl font-bold text-gray-800">{userProfile.name}</h1>
                                        )}
                                        <p className="text-rose-600 font-medium mt-1">{userProfile.profession}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                                            <span>Joined {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 text-rose-400" />
                                    About Me
                                </h3>
                                {isEditing ? (
                                    <div>
                                        <textarea
                                            value={editData.bio}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 300) {
                                                    handleInputChange('bio', value);
                                                }
                                            }}
                                            className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-rose-100 focus:ring resize-none"
                                            rows="3"
                                            placeholder="Tell us about yourself..."
                                            maxLength={300}
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-gray-500">Share a brief introduction about yourself</p>
                                            <p className={`text-xs font-medium ${editData.bio?.length >= 300 ? 'text-rose-500' : 'text-gray-500'}`}>
                                                {editData.bio?.length || 0}/300
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">{userProfile.bio || 'No bio added yet'}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-rose-400" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Nickname</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.nickname}
                                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="What should we call you?"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700 bg-rose-50 rounded-lg px-3 py-2">
                                            <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-rose-400" />
                                            {userProfile.nickname || 'Not set'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="your.email@example.com"
                                            disabled
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700 bg-rose-50 rounded-lg px-3 py-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3 text-rose-400" />
                                            {userProfile.email}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="+1 234 567 8900"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700 bg-rose-50 rounded-lg px-3 py-2">
                                            <FontAwesomeIcon icon={faPhone} className="h-3 w-3 text-rose-400" />
                                            {userProfile.phone}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700 bg-rose-50 rounded-lg px-3 py-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3 text-rose-400" />
                                            {userProfile.location}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Profession</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.profession}
                                            onChange={(e) => handleInputChange('profession', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="Your profession"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700 bg-rose-50 rounded-lg px-3 py-2">
                                            <FontAwesomeIcon icon={faBriefcase} className="h-3 w-3 text-rose-400" />
                                            {userProfile.profession}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interests & Personality */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Interests */}
                            <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-rose-400" />
                                    Interests
                                </h3>
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {interestOptions.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => handleArrayToggle('interests', interest)}
                                                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${editData.interests?.includes(interest)
                                                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                                                    : 'bg-white text-gray-500 border-rose-100 hover:border-rose-200'
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {userProfile.interests?.length > 0 ? (
                                            userProfile.interests.map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium border border-rose-100"
                                                >
                                                    {interest}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">No interests added</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Personality Traits */}
                            <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPalette} className="h-4 w-4 text-rose-400" />
                                    Personality
                                </h3>
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {personalityOptions.map((trait) => (
                                            <button
                                                key={trait}
                                                type="button"
                                                onClick={() => handleArrayToggle('personalityTraits', trait)}
                                                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${editData.personalityTraits?.includes(trait)
                                                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                                                    : 'bg-white text-gray-500 border-rose-100 hover:border-rose-200'
                                                    }`}
                                            >
                                                {trait}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {userProfile.personalityTraits?.length > 0 ? (
                                            userProfile.personalityTraits.map((trait) => (
                                                <span
                                                    key={trait}
                                                    className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium border border-rose-100"
                                                >
                                                    {trait}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">No traits added</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Activity */}
                    <div className="space-y-6">
                        {/* Profile Completion Card */}
                        <ProfileCompletionCard userProfile={userProfile} />

                        {/* Stats Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-rose-400" />
                                Your Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-rose-50 rounded-xl p-4 text-center">
                                        <FontAwesomeIcon icon={stat.icon} className={`h-6 w-6 ${stat.color} mb-2`} />
                                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                                        <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Legal Links */}
                            <div className="mt-6 pt-6 border-t border-rose-100 space-y-2">
                                <Link
                                    href="/privacy-policy"
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4" />
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/terms-of-service"
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faFileContract} className="h-4 w-4" />
                                    Terms of Service
                                </Link>
                            </div>

                            {/* Logout Button */}
                            <div className="mt-4 pt-4 border-t border-rose-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </main>

            <BottomNav activePage="profile" />
        </div>
    );
}

function MobileNavLink({ href, icon, label, active, disabled }) {
    if (disabled) {
        return (
            <div className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-gray-400 opacity-50 cursor-not-allowed">
                <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                {label}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-rose-600" : "text-gray-600"
                }`}
        >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            {label}
        </Link>
    );
}

function ProfileCompletionCard({ userProfile }) {
    const fields = [
        { key: 'name', label: 'Name', value: userProfile.name },
        { key: 'nickname', label: 'Nickname', value: userProfile.nickname },
        { key: 'phone', label: 'Phone', value: userProfile.phone },
        { key: 'location', label: 'Location', value: userProfile.location },
        { key: 'profession', label: 'Profession', value: userProfile.profession },
        { key: 'bio', label: 'Bio', value: userProfile.bio },
        { key: 'interests', label: 'Interests', value: userProfile.interests, isArray: true },
        { key: 'personalityTraits', label: 'Personality', value: userProfile.personalityTraits, isArray: true },
        { key: 'gender', label: 'Gender', value: userProfile.gender },
        { key: 'ageRange', label: 'Age Range', value: userProfile.ageRange },
    ];

    const completedFields = fields.filter(field => {
        if (field.isArray) {
            return field.value && Array.isArray(field.value) && field.value.length > 0;
        }
        return field.value && field.value.trim() !== '';
    });

    const incompleteFields = fields.filter(field => {
        if (field.isArray) {
            return !field.value || !Array.isArray(field.value) || field.value.length === 0;
        }
        return !field.value || field.value.trim() === '';
    });

    const percentage = Math.round((completedFields.length / fields.length) * 100);

    const getColorClass = () => {
        if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (percentage >= 50) return "text-orange-600 bg-orange-50 border-orange-200";
        return "text-rose-600 bg-rose-50 border-rose-200";
    };

    return (
        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-400" />
                Profile Completion
            </h3>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        {completedFields.length} of {fields.length} completed
                    </span>
                    <span className={`text-sm font-bold ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-orange-600' : 'text-rose-600'}`}>
                        {percentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-orange-500' : 'bg-rose-500'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Incomplete Fields */}
            {incompleteFields.length > 0 && (
                <div className={`rounded-lg border p-3 ${getColorClass()}`}>
                    <p className="text-xs font-semibold mb-2">Complete your profile:</p>
                    <ul className="space-y-1">
                        {incompleteFields.slice(0, 5).map((field) => (
                            <li key={field.key} className="text-xs flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {field.label}
                            </li>
                        ))}
                        {incompleteFields.length > 5 && (
                            <li className="text-xs italic">
                                +{incompleteFields.length - 5} more fields
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Completion Message */}
            {percentage === 100 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-sm font-semibold text-green-600">🎉 Profile Complete!</p>
                    <p className="text-xs text-green-600 mt-1">You've filled out all your information</p>
                </div>
            )}
        </div>
    );
}