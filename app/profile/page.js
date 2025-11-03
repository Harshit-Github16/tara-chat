"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faChartLine,
    faBookOpen,
    faComments,
    faUser,
    faEdit,
    faCog,
    faSignOutAlt,
    faCamera,
    faHeart,
    faFire,
    faCalendar,
    faBell,
    faShield,
    faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        bio: "On a journey of self-discovery and emotional wellness. Love journaling and connecting with supportive characters.",
        joinDate: "March 2024",
        avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex",
        streakDays: 12,
        totalJournals: 45,
        totalChats: 128,
        favoriteCharacter: "Calm Coach"
    });

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="text-lg font-semibold text-rose-600">Tara Profile</div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-6">
                {/* Profile Header */}
                <div className="mb-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="relative">
                            <img
                                src={userInfo.avatar}
                                alt="Profile"
                                className="h-24 w-24 rounded-full border-4 border-rose-100"
                            />
                            {isEditing && (
                                <button className="absolute -bottom-2 -right-2 rounded-full bg-rose-200 p-2 text-rose-700 shadow-sm hover:bg-rose-300">
                                    <FontAwesomeIcon icon={faCamera} className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            {isEditing ? (
                                <input
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                    className="mb-2 w-full rounded-xl border border-rose-200 px-4 py-2 text-xl font-bold outline-none ring-rose-100 focus:ring"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                            )}
                            <p className="text-sm text-gray-600">{userInfo.email}</p>
                            <p className="text-xs text-rose-600">Member since {userInfo.joinDate}</p>
                            {isEditing ? (
                                <textarea
                                    value={userInfo.bio}
                                    onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                                    className="mt-2 w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                    rows={3}
                                />
                            ) : (
                                <p className="mt-2 text-sm text-gray-700">{userInfo.bio}</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 shadow hover:bg-rose-300"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        icon={faFire}
                        title="Current Streak"
                        value={`${userInfo.streakDays} days`}
                        color="bg-orange-50 text-orange-600"
                    />
                    <StatCard
                        icon={faBookOpen}
                        title="Journal Entries"
                        value={userInfo.totalJournals}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        icon={faComments}
                        title="Chat Messages"
                        value={userInfo.totalChats}
                        color="bg-green-50 text-green-600"
                    />
                    <StatCard
                        icon={faHeart}
                        title="Favorite Character"
                        value={userInfo.favoriteCharacter}
                        color="bg-rose-50 text-rose-600"
                    />
                </div>

                {/* Settings & Options */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Account Settings */}
                    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Settings</h3>
                        <div className="space-y-3">
                            <SettingItem
                                icon={faBell}
                                title="Notifications"
                                description="Manage your notification preferences"
                                href="#"
                            />
                            <SettingItem
                                icon={faShield}
                                title="Privacy & Security"
                                description="Control your privacy settings"
                                href="#"
                            />
                            <SettingItem
                                icon={faCog}
                                title="App Preferences"
                                description="Customize your app experience"
                                href="#"
                            />
                        </div>
                    </div>

                    {/* Support & Help */}
                    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Support & Help</h3>
                        <div className="space-y-3">
                            <SettingItem
                                icon={faQuestionCircle}
                                title="Help Center"
                                description="Find answers to common questions"
                                href="#"
                            />
                            <SettingItem
                                icon={faComments}
                                title="Contact Support"
                                description="Get help from our support team"
                                href="#"
                            />
                            <SettingItem
                                icon={faSignOutAlt}
                                title="Sign Out"
                                description="Sign out of your account"
                                href="#"
                                isDestructive
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <div className="space-y-3">
                        <ActivityItem
                            icon={faBookOpen}
                            title="Created new journal entry"
                            time="2 hours ago"
                            description="Daily Reflection - Grateful for small wins today"
                        />
                        <ActivityItem
                            icon={faComments}
                            title="Chatted with Calm Coach"
                            time="5 hours ago"
                            description="Discussed stress management techniques"
                        />
                        <ActivityItem
                            icon={faCalendar}
                            title="Completed daily check-in"
                            time="1 day ago"
                            description="Mood: Inspired • Energy: High"
                        />
                        <ActivityItem
                            icon={faHeart}
                            title="Reached 10-day streak!"
                            time="2 days ago"
                            description="Congratulations on your consistency"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
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

function StatCard({ icon, title, value, color }) {
    return (
        <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    <FontAwesomeIcon icon={icon} />
                </span>
                <div>
                    <div className="text-xs text-gray-500">{title}</div>
                    <div className="text-sm font-bold text-gray-900">{value}</div>
                </div>
            </div>
        </div>
    );
}

function SettingItem({ icon, title, description, href, isDestructive = false }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl p-3 transition ${isDestructive
                ? "hover:bg-red-200 text-red-600"
                : "hover:bg-rose-200"
                }`}
        >
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${isDestructive
                ? "bg-red-200 text-red-600"
                : "bg-rose-200 text-rose-600"
                }`}>
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
            </span>
            <div className="flex-1">
                <div className={`text-sm font-medium ${isDestructive ? "text-red-700" : "text-gray-900"}`}>
                    {title}
                </div>
                <div className="text-xs text-gray-500">{description}</div>
            </div>
        </Link>
    );
}

function ActivityItem({ icon, title, time, description }) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-rose-200 p-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-200 text-rose-600">
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
            </span>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{title}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                </div>
                <div className="text-xs text-gray-600">{description}</div>
            </div>
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