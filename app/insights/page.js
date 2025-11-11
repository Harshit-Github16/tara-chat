"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../lib/api";
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
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [moodData, setMoodData] = useState([]);
    const [checkInDates, setCheckInDates] = useState([]);
    const [avgMood, setAvgMood] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch mood data and calculate insights
    useEffect(() => {
        if (user?.uid) {
            fetchMoodData();
        }
    }, [user]);

    const fetchMoodData = async () => {
        try {
            setLoading(true);
            // Fetch mood data from MongoDB
            const response = await api.get('/api/mood-mongo?limit=30');

            if (response.ok) {
                const data = await response.json();
                const moods = data.data?.entries || [];

                console.log('Fetched mood data:', moods);
                console.log('Sample mood entry:', moods[0]);
                setMoodData(moods);

                // Calculate average mood
                if (moods.length > 0) {
                    const total = moods.reduce((sum, m) => sum + (m.intensity || 5), 0);
                    setAvgMood((total / moods.length).toFixed(1));
                }

                // Extract unique check-in dates
                const dates = moods.map(m => m.date).filter((v, i, a) => a.indexOf(v) === i);
                setCheckInDates(dates);

                // Calculate streak
                calculateStreak(dates);
            }
        } catch (error) {
            console.error('Error fetching mood data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStreak = (dates) => {
        if (dates.length === 0) {
            setStreak(0);
            return;
        }

        // Sort dates in descending order
        const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
        const today = new Date().toISOString().split('T')[0];

        // Check if today or yesterday has entry
        const latestDate = sortedDates[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (latestDate !== today && latestDate !== yesterdayStr) {
            setStreak(0);
            return;
        }

        // Count consecutive days
        let currentStreak = 1;
        let currentDate = new Date(latestDate);

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = prevDate.toISOString().split('T')[0];

            if (sortedDates[i] === prevDateStr) {
                currentStreak++;
                currentDate = new Date(sortedDates[i]);
            } else {
                break;
            }
        }

        setStreak(currentStreak);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-2 rounded-full bg-rose-50 p-1 text-xs font-medium">
                                <button
                                    onClick={() => setSelectedPeriod("week")}
                                    className={`rounded-full px-3 py-1 ${selectedPeriod === "week" ? "bg-white shadow text-rose-600" : "text-gray-600"
                                        }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod("month")}
                                    className={`rounded-full px-3 py-1 ${selectedPeriod === "month" ? "bg-white shadow text-rose-600" : "text-gray-600"
                                        }`}
                                >
                                    Month
                                </button>
                                <button
                                    onClick={() => setSelectedPeriod("year")}
                                    className={`rounded-full px-3 py-1 ${selectedPeriod === "year" ? "bg-white shadow text-rose-600" : "text-gray-600"
                                        }`}
                                >
                                    Year
                                </button>
                            </div>

                            {/* Profile Icon */}
                            <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                            </Link>

                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-6">
                    {/* Stats Overview */}
                    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard
                            icon={faFire}
                            title="Check-in Streak"
                            value={loading ? "..." : `${streak} ${streak === 1 ? 'day' : 'days'}`}
                            color="bg-orange-50 text-orange-600"
                        />
                        <StatCard
                            icon={faHeart}
                            title="Emotional Insights"
                            value="--"
                            color="bg-rose-50 text-rose-600"
                            disabled
                        />
                        <StatCard
                            icon={faClock}
                            title="Recovery Time"
                            value="--"
                            color="bg-blue-50 text-blue-600"
                            disabled
                        />
                        <StatCard
                            icon={faBullseye}
                            title="Goals Met"
                            value="--"
                            color="bg-green-50 text-green-600"
                            disabled
                        />
                    </div>

                    {/* Main Charts Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Mood Meter - ACTIVE */}
                        <ChartCard title="Mood Meter" icon={faChartLine}>
                            <MoodMeter moodData={moodData} loading={loading} />
                        </ChartCard>

                        {/* Emotional Wheel - DISABLED */}
                        <ChartCard title="Emotional Wheel" icon={faBrain} disabled>
                            <DisabledChart />
                        </ChartCard>

                        {/* Check-in Streak - ACTIVE */}
                        <ChartCard title="Check-in Calendar" icon={faCalendar}>
                            <CheckInStreak checkInDates={checkInDates} loading={loading} />
                        </ChartCard>

                        {/* Support Reflection Radar - DISABLED */}
                        <ChartCard title="Support Reflection Radar" icon={faBullseye} disabled>
                            <DisabledChart />
                        </ChartCard>
                    </div>

                    {/* Suggestions & Triggers - DISABLED */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Mood Triggers - DISABLED */}
                        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="text-center px-4">
                                    <div className="text-3xl mb-2">🔒</div>
                                    <div className="text-sm font-semibold text-gray-700 mb-1">Chat atleast 7 days to get insights</div>
                                    <div className="text-xs text-gray-500">Keep chatting to unlock this feature</div>
                                </div>
                            </div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Mood Triggers</h3>
                            <div className="space-y-3 opacity-30">
                                {MOOD_TRIGGERS.map((trigger, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{trigger.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-16 rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-rose-500"
                                                    style={{ width: `${trigger.impact}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{trigger.impact}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions - DISABLED */}
                        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="text-center px-4">
                                    <div className="text-3xl mb-2">🔒</div>
                                    <div className="text-sm font-semibold text-gray-700 mb-1">Chat atleast 7 days to get insights</div>
                                    <div className="text-xs text-gray-500">Keep chatting to unlock this feature</div>
                                </div>
                            </div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Personalized Suggestions</h3>
                            <div className="space-y-3 opacity-30">
                                {SUGGESTIONS.map((suggestion, i) => (
                                    <div key={i} className="flex items-start gap-3 rounded-xl bg-rose-50 p-3">
                                        <span className="text-rose-500">
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
                <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
                    <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
                        <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                        <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                        <MobileNavLink href="/blogs" icon={faNewspaper} label="Blogs" />
                        <MobileNavLink href="/insights" icon={faChartLine} label="Insights" active />
                        <MobileNavLink href="/goals" icon={faBullseye} label="Goals" />
                    </div>
                </nav>
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ icon, title, value, color, disabled }) {
    return (
        <div className={`rounded-2xl border border-rose-100 bg-white p-4 shadow-sm relative ${disabled ? 'opacity-50' : ''}`}>
            {disabled && (
                <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <div className="text-xl">🔒</div>
                </div>
            )}
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

function DisabledChart() {
    return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl relative">
            <div className="text-center px-4">
                <div className="text-4xl mb-3">🔒</div>
                <div className="text-base font-semibold text-gray-700 mb-2">Chat atleast 7 days to get insights</div>
                <div className="text-sm text-gray-500">Keep chatting with TARA to unlock detailed insights</div>
            </div>
        </div>
    );
}

function ChartCard({ title, icon, children, disabled }) {
    return (
        <div className={`rounded-2xl border border-rose-100 bg-white p-6 shadow-sm ${disabled ? 'relative' : ''}`}>
            <div className="mb-4 flex items-center gap-2">
                <span className="text-rose-500">
                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function MoodMeter({ moodData = [], loading }) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fixed mood intensity values
    const moodIntensityMap = {
        'happy': 10,
        'excited': 9,
        'grateful': 8,
        'calm': 7,
        'tired': 5,
        'confused': 4,
        'stressed': 3,
        'anxious': 2,
        'sad': 1,
        'angry': 1
    };

    // Create chart data for last 7 days
    const chartData = [];
    const moodsWithData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];

        // Find ALL mood entries for this specific date
        const dayMoods = moodData.filter(m => m.date === dateStr);

        // Calculate average mood for this day using fixed intensity values
        let avgDayMood = 0;
        let hasData = false;

        if (dayMoods.length > 0) {
            const total = dayMoods.reduce((sum, m) => {
                const intensity = moodIntensityMap[m.mood.toLowerCase()] || 5;
                return sum + intensity;
            }, 0);
            avgDayMood = Math.round(total / dayMoods.length);
            hasData = true;

            // Store moods with calculated intensity for overall average
            dayMoods.forEach(m => {
                moodsWithData.push({
                    ...m,
                    calculatedIntensity: moodIntensityMap[m.mood.toLowerCase()] || 5
                });
            });
        }

        chartData.push({
            day: dayName,
            mood: avgDayMood,
            hasData: hasData,
            count: dayMoods.length
        });
    }

    const avgMood = moodsWithData.length > 0
        ? (moodsWithData.reduce((sum, m) => sum + m.calculatedIntensity, 0) / moodsWithData.length).toFixed(1)
        : 0;

    if (loading) {
        return <div className="text-center text-gray-500 py-8">Loading...</div>;
    }

    if (moodData.length === 0) {
        return <div className="text-center text-gray-500 py-8">No mood data yet. Start checking in!</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-2">
                {chartData.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="relative h-24 w-8 rounded-full bg-rose-100">
                            {item.hasData && (
                                <div
                                    className="absolute bottom-0 w-full rounded-full bg-rose-500"
                                    style={{ height: `${(item.mood / 10) * 100}%` }}
                                />
                            )}
                        </div>
                        <span className="text-xs text-gray-600">{item.day}</span>
                        <span className="text-xs font-semibold text-rose-600">
                            {item.hasData ? item.mood : '-'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-center text-sm text-gray-600">
                Average mood this week: <span className="font-semibold text-rose-600">{avgMood}/10</span>
            </div>
        </div>
    );
}

function EmotionalWheel() {
    const emotions = [
        { name: "Joy", value: 85, color: "bg-yellow-400" },
        { name: "Calm", value: 70, color: "bg-blue-400" },
        { name: "Love", value: 90, color: "bg-rose-400" },
        { name: "Anger", value: 20, color: "bg-red-400" },
        { name: "Sad", value: 15, color: "bg-gray-400" },
        { name: "Fear", value: 25, color: "bg-purple-400" },
    ];

    return (
        <div className="relative mx-auto h-48 w-48">
            <div className="absolute inset-0 rounded-full border-4 border-rose-100">
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
                    <div className="text-2xl font-bold text-rose-600">7.2</div>
                    <div className="text-xs text-gray-500">Overall</div>
                </div>
            </div>
        </div>
    );
}

function CheckInStreak({ checkInDates = [], loading }) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create last 7 days array with check-in status
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const hasCheckedIn = checkInDates.includes(dateStr);
        last7Days.push({
            date: dateStr,
            day: dayNames[date.getDay()],
            checked: hasCheckedIn
        });
    }

    // Calculate current streak
    let currentStreak = 0;
    for (let i = last7Days.length - 1; i >= 0; i--) {
        if (last7Days[i].checked) {
            currentStreak++;
        } else {
            break;
        }
    }

    if (loading) {
        return <div className="text-center text-gray-500 py-8">Loading...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {last7Days.map((item, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                        {item.day}
                    </div>
                ))}
            </div>

            {/* Last 7 days grid */}
            <div className="grid grid-cols-7 gap-2">
                {last7Days.map((item, dayIndex) => (
                    <div
                        key={dayIndex}
                        className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${item.checked
                            ? 'bg-rose-200 hover:bg-rose-300'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {item.checked ? (
                            <span className="text-green-600">✓</span>
                        ) : (
                            <span className="text-gray-300">○</span>
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
                            className="absolute bg-rose-300"
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
                            className="absolute h-3 w-3 rounded-full bg-rose-500"
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