"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../contexts/AuthContext";
import { InsightsProvider, useInsights } from "../contexts/InsightsContext";
import BottomNav from "../components/BottomNav";
import ProfileCompletionCircle from "../components/ProfileCompletionCircle";
import MoodMeterChart from "../components/MoodMeterChart";
import EmotionalWheel from "../components/EmotionalWheel";
import EmotionalFlowerChart from "../components/EmotionalFlowerChart";
import LifeAreaSuggestions from "../components/LifeAreaSuggestions";
import MoodTriggers from "../components/MoodTriggers";
import DASS21Results from "../components/DASS21Results";
import ReflectionRadar from "../components/ReflectionRadar";
import {
    faChartLine,
    faUser,
    faFire,
    faHeart,
    faBrain,
    faBullseye,
    faCalendar,
    faClock,
    faNewspaper,
    faBolt,
    faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

function InsightsPageContent() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { moodData, loading } = useInsights();
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [checkInDates, setCheckInDates] = useState([]);

    const [streak, setStreak] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        if (!authLoading && !user) {
            setShowLoginModal(true);
        } else {
            setShowLoginModal(false);
        }
    }, [user, authLoading]);

    const handleLoginSuccess = (isNewUser, userData) => {
        if (isNewUser || !userData.isOnboardingComplete) {
            router.push('/?showOnboarding=true');
        } else {
            setShowLoginModal(false);
        }
    };

    // Calculate insights when moodData changes
    useEffect(() => {
        if (moodData && moodData.moodByDate) {
            // Use backend calculated data
            setStreak(moodData.streakCount || 0);

            // Extract check-in dates from moodByDate
            const dates = Object.keys(moodData.moodByDate).map(dateStr => {
                // Convert DD-MM-YYYY to YYYY-MM-DD
                const [day, month, year] = dateStr.split('-');
                return `${year}-${month}-${day}`;
            });
            setCheckInDates(dates);
        }
    }, [moodData]);



    return (
        <>
            <Head>
                <title>AI Insights - Track Your Emotional Wellness Journey | Tara</title>
                <meta name="description" content="Get personalized insights into your emotional wellness journey. Track mood patterns, analyze emotional trends, and receive AI-powered recommendations with Tara's advanced analytics." />
                <meta name="keywords" content="emotional insights, mood analytics, wellness tracking, mental health insights, emotional patterns, mood trends, AI analytics, emotional wellness dashboard" />
                <link rel="canonical" href="https://www.tara4u.com/insights" />
                <meta property="og:title" content="AI Insights - Track Your Emotional Wellness Journey | Tara" />
                <meta property="og:description" content="Get personalized insights into your emotional wellness with AI-powered analytics and tracking." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.tara4u.com/insights" />
            </Head>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
                showCloseButton={false}
            />

            <div className={`min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 ${showLoginModal ? 'blur-sm pointer-events-none' : ''}`}>
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                        </Link>
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

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/stress-check"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition-all"
                                >
                                    <FontAwesomeIcon icon={faBrain} className="h-4 w-4" />
                                    Check Stress Level
                                </Link>
                                <Link href="/profile" className="rounded-full p-2 hover:bg-rose-100 transition-colors">
                                    <ProfileCompletionCircle size="md" showPercentage={false} />
                                </Link>
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
                            value={loading ? "..." : `${streak} ${streak === 1 ? 'day' : 'days'}`}
                            color="bg-orange-50 text-orange-600"
                        />
                        <MoodScoreCard moodData={moodData?.entries || []} weeklyAverage={moodData?.weeklyAverage} loading={loading} />
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
                            <MoodMeterChart moodData={moodData?.entries || []} loading={loading} />
                        </ChartCard>

                        {/* Check-in Streak - ACTIVE */}
                        <ChartCard title="Check-in Calendar" icon={faCalendar}>
                            <CheckInStreak checkInDates={checkInDates} loading={loading} />
                        </ChartCard>

                        {/* Mood Triggers - ACTIVE */}
                        <ChartCard title="Mood Triggers" icon={faBolt}>
                            <MoodTriggers />
                        </ChartCard>

                        {/* Emotional Wheel - ACTIVE */}
                        <ChartCard title="Emotional Wheel" icon={faBullseye}>
                            <EmotionalFlowerChart />
                        </ChartCard>
                    </div>

                    {/* Life Area Insights */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Support Reflection Radar - ACTIVE */}
                        <ChartCard title="Reflection Radar" icon={faBullseye}>
                            <ReflectionRadar moodData={moodData} userId={user?.uid} />
                        </ChartCard>

                        {/* AI-Generated Suggestions - ACTIVE */}
                        <ChartCard title="Improvement Suggestions" icon={faNewspaper}>
                            <LifeAreaSuggestions userId={user?.uid} />
                        </ChartCard>
                    </div>

                    {/* Stress Level Check Results */}
                    <div className="mt-6">
                        <ChartCard title="Stress Level Check" icon={faClipboardList}>
                            <DASS21Results />
                        </ChartCard>
                    </div>

                    {/* Suggestions & Triggers - DISABLED */}

                </div>

                <BottomNav activePage="insights" />
            </div>
        </>
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

function MoodScoreCard({ moodData, weeklyAverage, loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <div>
                        <div className="text-xs text-gray-500">Average Mood</div>
                        <div className="text-lg font-bold text-gray-900">...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Use backend calculated weekly average
    const numScore = weeklyAverage || 0;

    // Get emoji based on score (-3 to +3 range)
    let emoji = '😐';
    let color = 'bg-yellow-50 text-yellow-600';
    let textColor = 'text-yellow-600';

    if (numScore >= 2) {
        emoji = '😊';
        color = 'bg-green-50 text-green-600';
        textColor = 'text-green-600';
    } else if (numScore >= 1) {
        emoji = '🙂';
        color = 'bg-green-50 text-green-600';
        textColor = 'text-green-600';
    } else if (numScore >= -1) {
        emoji = '😐';
        color = 'bg-yellow-50 text-yellow-600';
        textColor = 'text-yellow-600';
    } else if (numScore >= -2) {
        emoji = '😔';
        color = 'bg-red-50 text-red-600';
        textColor = 'text-red-600';
    } else {
        emoji = '😢';
        color = 'bg-red-50 text-red-600';
        textColor = 'text-red-600';
    }

    return (
        <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} text-2xl`}>
                    {emoji}
                </span>
                <div>
                    <div className="text-xs text-gray-500">Weekly Average</div>
                    <div className={`text-lg font-bold ${textColor}`}>
                        {numScore > 0 ? '+' : ''}{numScore.toFixed(1)}/3
                    </div>
                </div>
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

            {/* Motivational Quote */}
            <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">💭</div>
                    <div>
                        <p className="text-sm text-gray-700 italic leading-relaxed">
                            "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity."
                        </p>
                        <p className="text-xs text-gray-500 mt-2 text-right">— Take care of yourself</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InsightsPage() {
    return (
        <InsightsProvider>
            <InsightsPageContent />
        </InsightsProvider>
    );
}