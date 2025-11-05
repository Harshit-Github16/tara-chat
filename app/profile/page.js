"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    faTrophy,
    faSmile,
    faStar,
    faMessage,
    faJournalWhills,
    faLightbulb
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        location: "New York, USA",
        profession: "Software Developer",
        bio: "Passionate about technology and mental wellness. Love to explore new ideas and connect with people.",
        interests: ["Technology", "Reading", "Travel", "Music"],
        personalityTraits: ["Creative", "Empathetic", "Optimistic"],
        joinedDate: "2024-01-15"
    });
    const [editData, setEditData] = useState({});

    // Mock data for recent activity and stats
    const recentActivity = [
        { id: 1, type: "chat", description: "Chatted with Amitabh Bachchan", time: "2 hours ago", icon: faComments },
        { id: 2, type: "journal", description: "Added new journal entry", time: "1 day ago", icon: faJournalWhills },
        { id: 3, type: "insight", description: "Viewed weekly insights", time: "2 days ago", icon: faChartLine },
        { id: 4, type: "chat", description: "Started conversation with Virat Kohli", time: "3 days ago", icon: faComments }
    ];

    const stats = [
        { label: "Total Chats", value: "24", icon: faComments, color: "text-blue-500" },
        { label: "Journal Entries", value: "12", icon: faBookOpen, color: "text-green-500" },
        { label: "Days Active", value: "15", icon: faCalendarAlt, color: "text-purple-500" },
        { label: "Streak", value: "7", icon: faFire, color: "text-orange-500" }
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
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            setEditData(profile);
        } else {
            setEditData(userProfile);
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
            [field]: prev[field]?.includes(value)
                ? prev[field].filter(item => item !== value)
                : [...(prev[field] || []), value]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('isNewUser');
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-lg font-semibold text-rose-600">Tara</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                Edit Profile
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
                                    className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="rounded-full p-2 text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Logout"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                        </button>
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
                            <div className="bg-gradient-to-r from-rose-50 to-rose-100 px-6 py-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                                        <FontAwesomeIcon icon={faUser} className="h-10 w-10 text-rose-400" />
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
                                    <textarea
                                        value={editData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-rose-100 focus:ring resize-none"
                                        rows="3"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">{userProfile.bio}</p>
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
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-300"
                                            placeholder="your.email@example.com"
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
                        {/* Stats Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-rose-400" />
                                Your Stats
                            </h3>
                            <div className="space-y-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${stat.color}`}>
                                                <FontAwesomeIcon icon={stat.icon} className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-800">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-rose-400" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                            <FontAwesomeIcon icon={activity.icon} className="h-3 w-3 text-rose-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-rose-400" />
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    href="/chatlist"
                                    className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faComments} className="h-4 w-4 text-rose-400" />
                                    <span className="text-sm font-medium text-gray-700">Start New Chat</span>
                                </Link>
                                <Link
                                    href="/journal"
                                    className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4 text-rose-400" />
                                    <span className="text-sm font-medium text-gray-700">Write Journal</span>
                                </Link>
                                <Link
                                    href="/insights"
                                    className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-rose-400" />
                                    <span className="text-sm font-medium text-gray-700">View Insights</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navbar */}
            <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
                <div className="mx-auto grid max-w-7xl grid-cols-4 px-2 py-2 text-xs text-gray-600 sm:text-sm">
                    <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
                    <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                    <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                    <MobileNavLink href="/profile" icon={faUser} label="Profile" active />
                </div>
            </nav>
        </div>
    );
}

function MobileNavLink({ href, icon, label, active }) {
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