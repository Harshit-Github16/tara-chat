"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faEye,
    faClock,
    faUsers,
    faChartLine,
    faExclamationTriangle,
    faHeart,
    faGlobe,
    faMobileAlt
} from "@fortawesome/free-solid-svg-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import BottomNav from "../../components/BottomNav";

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

// Enhanced Chart Components
const TopPagesChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-8 shadow-xl shadow-rose-100/20 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="p-2 bg-rose-50 rounded-xl">🔥</span>
                {title}
            </h3>
            <div className="space-y-6">
                {data.slice(0, 5).map((item, index) => {
                    const percentage = ((item.value / maxValue) * 100);
                    const colors = [
                        'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-200',
                        'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-200',
                        'bg-gradient-to-r from-green-500 to-emerald-500 shadow-emerald-200',
                        'bg-gradient-to-r from-orange-500 to-amber-500 shadow-amber-200',
                        'bg-gradient-to-r from-purple-500 to-violet-500 shadow-purple-200'
                    ];

                    return (
                        <div key={index} className="group cursor-default">
                            <div className="flex items-center justify-between mb-2 px-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-gray-300 group-hover:text-rose-400 transition-colors">
                                        0{index + 1}
                                    </span>
                                    <div>
                                        <p className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.value} total views</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-800">{percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-100/50 rounded-full h-3 p-0.5 overflow-hidden border border-gray-50 shadow-inner">
                                <div
                                    className={`${colors[index]} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    let currentOffset = 0;

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-8 shadow-xl shadow-rose-100/20 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="p-2 bg-rose-50 rounded-xl">📊</span>
                {title}
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative w-48 h-48 group">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg" viewBox="0 0 100 100">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const colors = ['#F43F5E', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'];
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -currentOffset;
                            currentOffset += percentage;

                            return (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="12"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-in-out hover:opacity-80 cursor-pointer"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white/50 backdrop-blur-md rounded-full w-24 h-24 flex flex-col items-center justify-center border border-white shadow-inner">
                            <p className="text-3xl font-black text-gray-800 leading-none">{total}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">Total</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                    {data.map((item, index) => {
                        const colors = ['bg-rose-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
                        const lightColors = ['bg-rose-50', 'bg-cyan-50', 'bg-emerald-50', 'bg-amber-50', 'bg-violet-50'];
                        const percentage = ((item.value / total) * 100).toFixed(1);

                        return (
                            <div key={index} className={`flex items-center justify-between p-3 rounded-2xl gap-2 ${lightColors[index % lightColors.length]} border border-transparent hover:border-white hover:shadow-md transition-all duration-300`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} ring-4 ring-white shadow-sm`}></div>
                                    <p className="text-sm font-bold text-gray-700">{item.label}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-800">{percentage}%</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.value} users</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const GeoStatsChart = ({ data, title }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-8 shadow-xl shadow-rose-100/20 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="p-2 bg-rose-50 rounded-xl">🌍</span>
                {title}
            </h3>
            {data.length > 0 ? (
                <div className="space-y-5">
                    {data.map((item, index) => {
                        const percentage = maxValue > 0 ? ((item.count / maxValue) * 100) : 0;
                        return (
                            <div key={index} className="group">
                                <div className="flex items-center justify-between mb-1.5 px-1">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                            {index + 1}
                                        </span>
                                        <p className="font-bold text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{item.city || 'Unknown'}</p>
                                    </div>
                                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                        {item.count} users
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100/50 rounded-full h-2 overflow-hidden border border-gray-50">
                                    <div
                                        className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 opacity-30">
                    <p className="text-sm font-bold">No location footprints yet</p>
                </div>
            )}
        </div>
    );
};

const TopChatUsers = ({ users }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-8 shadow-xl shadow-rose-100/20 hover:shadow-2xl hover:shadow-rose-100/40 transition-all duration-500 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <FontAwesomeIcon icon={faUsers} className="text-rose-900 text-9xl transform -rotate-12" />
            </div>
            <div className="relative h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-2 bg-rose-50 rounded-xl">🤖</span>
                        Most Users
                    </h2>
                    <span className="px-3 py-1 bg-rose-50 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-widest border border-rose-100">
                        Top 10 Leaders
                    </span>
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <div key={index} className="group flex items-center justify-between p-4 
                            rounded-2xl bg-rose-50/50 border border-rose-100/50 hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-600' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                    index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-700' :
                                                        'bg-gradient-to-br from-rose-500 to-purple-600'}`}>
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                                            ) : (
                                                (user.name || 'U').charAt(0)
                                            )}
                                        </div>
                                        {index < 3 && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] shadow-lg">
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm group-hover:text-rose-600 transition-colors truncate max-w-[120px]">
                                            {user.name || 'Anonymous'}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[120px]">
                                            {user.email || 'No Email'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-gray-800 leading-none">{user.conversationCount}</p>
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Chats</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <p className="text-gray-500 text-sm">No chat data yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color, subtitle, trend, gradient }) => (
    <div className={`relative overflow-hidden bg-white rounded-2xl border border-rose-100/50 p-6 shadow-xl shadow-rose-100/10 hover:shadow-2xl hover:shadow-rose-200/30 transition-all duration-500 group cursor-default`}>
        {/* Background Decorative Element */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 ${color}`}></div>

        <div className="relative flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient || color}`}>
                        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{title}</p>
                        {subtitle && <p className="text-[9px] text-gray-400 font-medium leading-none">{subtitle}</p>}
                    </div>
                </div>

                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-gray-800 group-hover:text-rose-600 transition-colors tracking-tight">
                        {value}
                    </p>
                    {trend && (
                        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sparkline Visual Placeholder */}
        <div className="mt-4 flex items-end gap-1 h-8 opacity-20">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
                <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-1000 group-hover:opacity-100 ${color}`}
                    style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                ></div>
            ))}
        </div>
    </div>
);

export default function AnalyticsPage() {
    const { user, loading: authLoading } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState(7);
    const [isClient, setIsClient] = useState(false);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/analytics/dashboard?days=${selectedDays}`);
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (user?.email && ADMIN_EMAILS.includes(user.email)) {
            fetchAnalytics();
        }
    }, [user, selectedDays]);

    const formatTime = (milliseconds) => {
        if (!milliseconds) return '0s';
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    };

    const formatPageName = (page) => {
        // Clean up the page path and make it more readable
        let cleanPage = page.replace(/^\//, ''); // Remove leading slash

        // Handle specific page mappings
        const pageMap = {
            '': 'Home Page',
            'insights': '📊 Insights Dashboard',
            'blog': '📝 Wellness Blog',
            'chatlist': '💬 Chat List',
            'journal': '📔 Journal',
            'profile': '👤 User Profile',
            'admin': '⚙️ Admin Dashboard',
            'admin/analytics': '📈 Analytics Dashboard',
            'admin/test-tracking': '🧪 Test Tracking',
            'admin/blog': '📝 Blog Management',
            'onboarding': '🚀 User Onboarding',
            'login': '🔐 Login Page',
            'contact': '📞 Contact Us',
            'about': 'ℹ️ About Us',
            'privacy-policy': '🔒 Privacy Policy',
            'terms-of-service': '📋 Terms of Service',
            'stress-check': '😰 Stress Assessment',
            'dass21': '📋 DASS-21 Assessment',
            'goals': '🎯 Goals Tracker',
            'welcome': '👋 Welcome Page'
        };

        // Check if we have a direct mapping
        if (pageMap[cleanPage]) {
            return pageMap[cleanPage];
        }

        // Handle nested paths
        if (cleanPage.includes('/')) {
            const parts = cleanPage.split('/');
            const mappedParts = parts.map(part => {
                if (pageMap[part]) return pageMap[part];
                return part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
            });
            return mappedParts.join(' › ');
        }

        // Default formatting: capitalize and replace hyphens
        return cleanPage.charAt(0).toUpperCase() + cleanPage.slice(1).replace(/-/g, ' ');
    };

    if (!isClient || authLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-2xl border-4 border-rose-100 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-2xl border-t-4 border-rose-600 animate-spin"></div>
                </div>
                <p className="text-rose-600 font-black mt-6 tracking-widest text-xs uppercase animate-pulse">Checking Permissions...</p>
            </div>
        );
    }

    if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                    <Link href="/journal" className="text-rose-600 hover:underline">
                        Go back to Journal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col bg-[#FDF8F9]">
                <header className="sticky top-0 z-50 border-b border-rose-100/50 bg-white/70 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/admin" className="group rounded-xl sm:rounded-2xl p-2 sm:p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src="/taralogo.jpg"
                                        alt="Tara Logo"
                                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl object-cover shadow-md ring-2 ring-white"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden sm:flex bg-rose-50/50 p-1 rounded-xl border border-rose-100">
                                {[1, 7, 30, 90].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDays(d)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${selectedDays === d
                                            ? 'bg-white text-rose-600 shadow-sm'
                                            : 'text-gray-500 hover:text-rose-600'
                                            }`}
                                    >
                                        {d === 1 ? 'Last 24h' : `${d} Days`}
                                    </button>
                                ))}
                            </div>
                            <select
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                                className="sm:hidden px-2 py-1.5 rounded-lg border border-rose-200 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                            >
                                <option value={1}>24 Hours</option>
                                <option value={7}>7 Days</option>
                                <option value={30}>30 Days</option>
                                <option value={90}>90 Days</option>
                            </select>
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6">
                    <div className="min-w-0 pb-2">
                        <h1 className="text-[12px] sm:text-[20px] font-black text-gray-800 font-semibold leading-none truncate">Analytics Dashboard</h1>
                        {/* <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 sm:mt-1 truncate">Tara4u Property</p> */}
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[60vh]">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 rounded-2xl border-4 border-rose-100 animate-pulse"></div>
                                <div className="absolute inset-0 rounded-2xl border-t-4 border-rose-600 animate-spin"></div>
                            </div>
                            <p className="text-rose-600 font-black mt-6 tracking-widest text-xs uppercase animate-pulse">Loading Intelligence...</p>
                        </div>
                    ) : analytics ? (
                        <div className="space-y-10">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                <MetricCard
                                    title="Total Page Views"
                                    value={analytics.summary.totalViews.toLocaleString()}
                                    icon={faEye}
                                    color="bg-blue-500"
                                    gradient="bg-gradient-to-br from-blue-400 to-indigo-600"
                                    subtitle="Site Traffic"
                                />
                                <MetricCard
                                    title="Unique Visitors"
                                    value={analytics.summary.totalUsers}
                                    icon={faUsers}
                                    color="bg-green-500"
                                    gradient="bg-gradient-to-br from-emerald-400 to-green-600"
                                    subtitle="New & Old"
                                />
                                <MetricCard
                                    title="Returning Users"
                                    value={analytics.summary.returningUsers || 0}
                                    icon={faChartLine}
                                    color="bg-purple-500"
                                    gradient="bg-gradient-to-br from-purple-400 to-indigo-600"
                                    subtitle="Loyal User Base"
                                />
                                <MetricCard
                                    title="Bounce Rate"
                                    value={`${analytics.summary.avgBounceRate}%`}
                                    icon={faExclamationTriangle}
                                    color="bg-orange-500"
                                    gradient="bg-gradient-to-br from-amber-400 to-orange-600"
                                    subtitle="Engagement Quality"
                                />
                                <MetricCard
                                    title="Active Now"
                                    value={analytics.activeSessions.length}
                                    icon={faHeart}
                                    color="bg-rose-500"
                                    gradient="bg-gradient-to-br from-pink-400 to-rose-600"
                                    subtitle="Live Interaction"
                                />
                            </div>

                            {/* Advanced User Demographics */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                                <GeoStatsChart
                                    title="Top User Regions (Cities)"
                                    data={analytics.geoStats || []}
                                />
                                <PieChart
                                    title="Device Distribution"
                                    data={analytics.deviceStats || []}
                                />
                                <PieChart
                                    title="Browser Rankings"
                                    data={analytics.browserStats || []}
                                />
                            </div>

                            {/* Main Charts area */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                <div className="xl:col-span-2 space-y-8">
                                    <TopPagesChart
                                        title="Most Popular Destinations"
                                        data={analytics.pageStats.map(page => ({
                                            label: formatPageName(page.page),
                                            value: page.totalViews
                                        }))}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <PieChart
                                            title="Engagement Levels"
                                            data={[
                                                {
                                                    label: 'Power Users (>1min)',
                                                    value: analytics.pageStats.filter(p => p.avgTimeSpent > 60000).length
                                                },
                                                {
                                                    label: 'Browsers (30s-1min)',
                                                    value: analytics.pageStats.filter(p => p.avgTimeSpent > 30000 && p.avgTimeSpent <= 60000).length
                                                },
                                                {
                                                    label: 'Leavers (<30s)',
                                                    value: analytics.pageStats.filter(p => p.avgTimeSpent <= 30000).length
                                                }
                                            ]}
                                        />
                                        <TopChatUsers users={analytics.topChatUsers} />
                                    </div>
                                </div>
                                <div className="xl:col-span-1">
                                    {/* Detailed Performance Table Adjusted for sidebar */}
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/50 shadow-xl overflow-hidden h-full flex flex-col">
                                        <div className="p-6 border-b border-gray-50">
                                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                                                <span className="p-2 bg-rose-50 rounded-xl">📈</span>
                                                Page Rank
                                            </h2>
                                        </div>
                                        <div className="overflow-x-auto flex-1 h-[530px] overflow-y-auto custom-scrollbar">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                                    <tr className="bg-gray-50/50">
                                                        <th className="py-4 px-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">Page</th>
                                                        <th className="py-4 px-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">Views</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {analytics.pageStats.map((page, index) => (
                                                        <tr key={index} className="group hover:bg-rose-50/30 transition-all duration-300">
                                                            <td className="py-3 px-6">
                                                                <span className="text-xs font-bold text-gray-800 group-hover:text-rose-600 transition-colors truncate block max-w-[120px]">
                                                                    {formatPageName(page.page)}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-6 text-right">
                                                                <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black">
                                                                    {page.totalViews}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Sessions - Timeline View */}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <div className="text-8xl mb-6">📉</div>
                            <h2 className="text-2xl font-black text-gray-800">Intelligence Void</h2>
                            <p className="text-gray-500 mt-2 max-w-sm">No analytics data footprints found for the selected timeline. Try expanding the date range.</p>
                        </div>
                    )}
                </main>

                <div className="pb-24"></div>
                <BottomNav activePage="admin" />
            </div>
        </ProtectedRoute>
    );
}