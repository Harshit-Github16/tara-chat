"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faBookOpen,
    faComments,
    faUser,
    faFire,
    faHeart,
    faBrain,
    faBullseye,
    faCalendar,
    faClock,

    faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

export default function InsightsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("week");

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-pink-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-lg font-semibold text-pink-600">Tara</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2 rounded-full bg-pink-50 p-1 text-xs font-medium">
                            <button
                                onClick={() => setSelectedPeriod("week")}
                                className={`rounded-full px-3 py-1 ${selectedPeriod === "week" ? "bg-white shadow text-pink-600" : "text-gray-600"
                                    }`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setSelectedPeriod("month")}
                                className={`rounded-full px-3 py-1 ${selectedPeriod === "month" ? "bg-white shadow text-pink-600" : "text-gray-600"
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setSelectedPeriod("year")}
                                className={`rounded-full px-3 py-1 ${selectedPeriod === "year" ? "bg-white shadow text-pink-600" : "text-gray-600"
                                    }`}
                            >
                                Year
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Stats Overview */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        icon={faFire}
                        title="Check-in Streak"
                        value="12 days"
                        color="bg-orange-50 text-orange-600"
                    />
                    <StatCard
                        icon={faHeart}
                        title="Avg Mood"
                        value="7.2/10"
                        color="bg-pink-50 text-pink-600"
                    />
                    <StatCard
                        icon={faClock}
                        title="Recovery Time"
                        value="2.3 hrs"
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        icon={faBullseye}
                        title="Goals Met"
                        value="8/10"
                        color="bg-green-50 text-green-600"
                    />
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Mood Meter */}
                    <ChartCard title="Mood Meter" icon={faChartLine}>
                        <MoodMeter />
                    </ChartCard>

                    {/* Emotional Wheel */}
                    <ChartCard title="Emotional Wheel" icon={faBrain}>
                        <EmotionalWheel />
                    </ChartCard>

                    {/* Check-in Streak */}
                    <ChartCard title="Check-in Calendar" icon={faCalendar}>
                        <CheckInStreak />
                    </ChartCard>

                    {/* Support Reflection Radar */}
                    <ChartCard title="Support Reflection Radar" icon={faBullseye}>
                        <SupportRadar />
                    </ChartCard>
                </div>

                {/* Suggestions & Triggers */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Mood Triggers */}
                    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Mood Triggers</h3>
                        <div className="space-y-3">
                            {MOOD_TRIGGERS.map((trigger, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{trigger.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-16 rounded-full bg-gray-200">
                                            <div
                                                className="h-2 rounded-full bg-pink-500"
                                                style={{ width: `${trigger.impact}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{trigger.impact}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Personalized Suggestions</h3>
                        <div className="space-y-3">
                            {SUGGESTIONS.map((suggestion, i) => (
                                <div key={i} className="flex items-start gap-3 rounded-xl bg-pink-50 p-3">
                                    <span className="text-pink-500">
                                        <FontAwesomeIcon icon={suggestion.icon} className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{suggestion.title}</div>
                                        <div className="text-xs text-gray-600">{suggestion.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="sticky bottom-0 z-10 border-t border-pink-100 bg-white/90 backdrop-blur">
                <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
                    <MobileNavLink href="/mood" icon={faHeart} label="Mood" />
                    <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                    <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                    <MobileNavLink href="/insights" icon={faChartLine} label="Insights" active />
                    <MobileNavLink href="/profile" icon={faUser} label="Profile" />
                </div>
            </nav>
        </div>
    );
}

function StatCard({ icon, title, value, color }) {
    return (
        <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    <FontAwesomeIcon icon={icon} />
                </span>
                <div>
                    <div className="text-xs text-gray-500">{title}</div>
                    <div className="text-lg font-bold text-gray-900">{value}</div>
                </div>
            </div>
        </div>
    );
}

function ChartCard({ title, icon, children }) {
    return (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-pink-500">
                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function MoodMeter() {
    const moodData = [
        { day: "Mon", mood: 7 },
        { day: "Tue", mood: 8 },
        { day: "Wed", mood: 6 },
        { day: "Thu", mood: 9 },
        { day: "Fri", mood: 7 },
        { day: "Sat", mood: 8 },
        { day: "Sun", mood: 9 },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-2">
                {moodData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="relative h-24 w-8 rounded-full bg-pink-100">
                            <div
                                className="absolute bottom-0 w-full rounded-full bg-rose-200"
                                style={{ height: `${(item.mood / 10) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-600">{item.day}</span>
                        <span className="text-xs font-semibold text-pink-600">{item.mood}</span>
                    </div>
                ))}
            </div>
            <div className="text-center text-sm text-gray-600">
                Average mood this week: <span className="font-semibold text-pink-600">7.7/10</span>
            </div>
        </div>
    );
}

function EmotionalWheel() {
    const emotions = [
        { name: "Joy", value: 85, color: "bg-yellow-400" },
        { name: "Calm", value: 70, color: "bg-blue-400" },
        { name: "Love", value: 90, color: "bg-pink-400" },
        { name: "Anger", value: 20, color: "bg-red-400" },
        { name: "Sad", value: 15, color: "bg-gray-400" },
        { name: "Fear", value: 25, color: "bg-purple-400" },
    ];

    return (
        <div className="relative mx-auto h-48 w-48">
            <div className="absolute inset-0 rounded-full border-4 border-pink-100">
                {emotions.map((emotion, i) => {
                    const angle = (i * 60) - 90;
                    const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                    const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);

                    return (
                        <div
                            key={emotion.name}
                            className="absolute flex flex-col items-center"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className={`h-8 w-8 rounded-full ${emotion.color} flex items-center justify-center text-white text-xs font-bold`}>
                                {emotion.value}
                            </div>
                            <span className="mt-1 text-xs text-gray-600">{emotion.name}</span>
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">7.2</div>
                    <div className="text-xs text-gray-500">Overall</div>
                </div>
            </div>
        </div>
    );
}

function CheckInStreak() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Last 7 days check-in data (1 = checked in, 0 = missed)
    const last7Days = [1, 1, 0, 1, 1, 1, 1]; // Example: missed Wednesday

    // Calculate current streak
    let currentStreak = 0;
    for (let i = last7Days.length - 1; i >= 0; i--) {
        if (last7Days[i] === 1) {
            currentStreak++;
        } else {
            break;
        }
    }

    return (
        <div className="space-y-4">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Last 7 days grid */}
            <div className="grid grid-cols-7 gap-2">
                {last7Days.map((checked, dayIndex) => (
                    <div
                        key={dayIndex}
                        className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${checked
                            ? 'bg-rose-200 hover:bg-rose-300'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {checked ? (
                            <span className="text-yellow-500">🏆</span>
                        ) : (
                            <span className="text-gray-300">🏆</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Streak display */}
            <div className="text-center pt-3 border-t border-rose-100">
                <div className="text-lg font-bold text-rose-500">
                    {currentStreak > 0 ? `${currentStreak} day streak! 🔥` : 'Start your streak! 💪'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {currentStreak > 0 ? 'Keep it up! You\'re doing great' : 'Check in daily to build your streak'}
                </div>
            </div>
        </div>
    );
}

function SupportRadar() {
    const categories = [
        { name: "Family", value: 85 },
        { name: "Friends", value: 70 },
        { name: "Work", value: 60 },
        { name: "Health", value: 90 },
        { name: "Hobbies", value: 75 },
        { name: "Goals", value: 80 },
    ];

    return (
        <div className="relative mx-auto h-48 w-48">
            {[20, 40, 60, 80, 100].map((radius) => (
                <div
                    key={radius}
                    className="absolute border border-gray-200 rounded-full"
                    style={{
                        width: `${radius}%`,
                        height: `${radius}%`,
                        left: `${(100 - radius) / 2}%`,
                        top: `${(100 - radius) / 2}%`,
                    }}
                />
            ))}

            {categories.map((category, i) => {
                const angle = (i * 60) - 90;
                const radius = (category.value / 100) * 40;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                return (
                    <div key={category.name}>
                        <div
                            className="absolute bg-pink-300"
                            style={{
                                left: '50%',
                                top: '50%',
                                width: '1px',
                                height: `${radius}%`,
                                transformOrigin: 'top',
                                transform: `rotate(${angle + 90}deg)`,
                            }}
                        />
                        <div
                            className="absolute h-3 w-3 rounded-full bg-pink-500"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        <div
                            className="absolute text-xs text-gray-600"
                            style={{
                                left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                                top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {category.name}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function MobileNavLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-pink-600" : "text-gray-600"
                }`}
        >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            {label}
        </Link>
    );
}

const MOOD_TRIGGERS = [
    { name: "Work Stress", impact: 85 },
    { name: "Sleep Quality", impact: 70 },
    { name: "Exercise", impact: 60 },
    { name: "Social Media", impact: 45 },
    { name: "Weather", impact: 30 },
];

const SUGGESTIONS = [
    {
        icon: faBrain,
        title: "Try 5-minute meditation",
        desc: "Your stress levels are high today"
    },
    {
        icon: faHeart,
        title: "Call a friend",
        desc: "Social connection boosts mood"
    },
    {
        icon: faBullseye,
        title: "Take a short walk",
        desc: "Physical activity helps anxiety"
    },
    {
        icon: faBookOpen,
        title: "Journal your thoughts",
        desc: "Writing helps process emotions"
    },
];