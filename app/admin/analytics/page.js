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
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                🔥 {title}
            </h3>
            <div className="space-y-4">
                {data.slice(0, 5).map((item, index) => {
                    const percentage = ((item.value / maxValue) * 100);
                    const colors = [
                        'bg-gradient-to-r from-rose-500 to-pink-500',
                        'bg-gradient-to-r from-blue-500 to-cyan-500',
                        'bg-gradient-to-r from-green-500 to-emerald-500',
                        'bg-gradient-to-r from-orange-500 to-amber-500',
                        'bg-gradient-to-r from-purple-500 to-violet-500'
                    ];

                    return (
                        <div key={index} className="group hover:bg-gray-50 p-3 rounded-xl transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full ${colors[index]} flex items-center justify-center text-white font-bold text-sm`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.value} views</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-700">{percentage.toFixed(1)}%</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${colors[index]} h-2 rounded-full transition-all duration-700 ease-out`}
                                    style={{ width: `${Math.max(percentage, 5)}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.length > 5 && (
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Showing top 5 of {data.length} pages</p>
                </div>
            )}
        </div>
    );
};

const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 {title}
            </h3>
            <div className="flex items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const colors = ['#f43f5e', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

                            return (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r="15.915"
                                    fill="transparent"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="8"
                                    strokeDasharray={`${percentage} ${100 - percentage}`}
                                    strokeDashoffset={index === 0 ? 0 : -data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0)}
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{total}</p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.map((item, index) => {
                        const colors = ['bg-rose-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
                        const percentage = ((item.value / total) * 100).toFixed(1);

                        return (
                            <div key={index} className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                    <p className="text-xs text-gray-500">{percentage}% ({item.value})</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800 group-hover:text-rose-600 transition-colors">
                    {value}
                </p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                {trend && (
                    <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}% vs last period
                    </p>
                )}
            </div>
            <div className={`${color} rounded-full p-4 group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState(7);

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
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                            </Link>
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">📊 Analytics Dashboard</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                                className="px-3 py-1 rounded-lg border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            >
                                <option value={1}>Last 24 hours</option>
                                <option value={7}>Last 7 days</option>
                                <option value={30}>Last 30 days</option>
                                <option value={90}>Last 90 days</option>
                            </select>
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading analytics...</p>
                            </div>
                        </div>
                    ) : analytics ? (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    title="Total Page Views"
                                    value={analytics.summary.totalViews.toLocaleString()}
                                    icon={faEye}
                                    color="bg-blue-500"
                                    subtitle="All page visits"
                                />
                                <MetricCard
                                    title="Unique Visitors"
                                    value={analytics.summary.totalUsers}
                                    icon={faUsers}
                                    color="bg-green-500"
                                    subtitle="Different users"
                                />
                                <MetricCard
                                    title="Avg Bounce Rate"
                                    value={`${analytics.summary.avgBounceRate}%`}
                                    icon={faExclamationTriangle}
                                    color="bg-orange-500"
                                    subtitle="Quick exits"
                                />
                                <MetricCard
                                    title="Active Now"
                                    value={analytics.activeSessions.length}
                                    icon={faHeart}
                                    color="bg-red-500"
                                    subtitle="Live users"
                                />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Top Pages Chart */}
                                <TopPagesChart
                                    title="Most Popular Pages"
                                    data={analytics.pageStats.map(page => ({
                                        label: formatPageName(page.page),
                                        value: page.totalViews
                                    }))}
                                />

                                {/* User Engagement Pie Chart */}
                                <PieChart
                                    title="User Engagement Levels"
                                    data={[
                                        {
                                            label: 'High Engagement (>1min)',
                                            value: analytics.pageStats.filter(p => p.avgTimeSpent > 60000).length
                                        },
                                        {
                                            label: 'Medium Engagement (30s-1min)',
                                            value: analytics.pageStats.filter(p => p.avgTimeSpent > 30000 && p.avgTimeSpent <= 60000).length
                                        },
                                        {
                                            label: 'Low Engagement (<30s)',
                                            value: analytics.pageStats.filter(p => p.avgTimeSpent <= 30000).length
                                        }
                                    ]}
                                />
                            </div>

                            {/* Page Performance Table */}
                            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    📈 Detailed Page Performance
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Page</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Views</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Users</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Avg Time</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Bounce Rate</th>
                                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analytics.pageStats.map((page, index) => (
                                                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 text-gray-800 font-medium">
                                                        {formatPageName(page.page)}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                                            {page.totalViews}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                            {page.uniqueUsers}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                                                        {formatTime(page.avgTimeSpent)}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${page.bounceRate > 70
                                                                ? 'bg-red-100 text-red-700'
                                                                : page.bounceRate > 40
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {page.bounceRate}%
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-lg">
                                                        {page.avgTimeSpent > 60000 ? '🔥' :
                                                            page.avgTimeSpent > 30000 ? '👍' :
                                                                page.avgTimeSpent > 10000 ? '👌' : '⚠️'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Live Sessions */}
                            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    🟢 Live User Activity
                                </h2>
                                <div className="space-y-3">
                                    {analytics.activeSessions.length > 0 ? (
                                        analytics.activeSessions.map((session, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {session.userName || session.userEmail || 'Anonymous User'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            📍 {formatPageName(session.lastPage)} • 👀 {session.pageViews} pages viewed
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        ⏱️ {formatTime(session.totalTimeSpent)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(session.lastActivity).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-2">😴</div>
                                            <p className="text-gray-500">No active users right now</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">📱</div>
                                    <h3 className="font-semibold text-gray-800">Mobile Users</h3>
                                    <p className="text-2xl font-bold text-rose-600">
                                        {Math.round((analytics.summary.totalUsers * 0.7))}
                                    </p>
                                    <p className="text-xs text-gray-500">~70% mobile traffic</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">⚡</div>
                                    <h3 className="font-semibold text-gray-800">Avg Session</h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatTime(analytics.summary.totalViews > 0 ?
                                            analytics.pageStats.reduce((sum, p) => sum + p.avgTimeSpent, 0) / analytics.pageStats.length : 0)}
                                    </p>
                                    <p className="text-xs text-gray-500">Time per visit</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <h3 className="font-semibold text-gray-800">Top Page</h3>
                                    <p className="text-lg font-bold text-green-600">
                                        {analytics.pageStats.length > 0 ? formatPageName(analytics.pageStats[0].page) : 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">Most popular</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-gray-600">No analytics data available</p>
                        </div>
                    )}
                </main>

                <BottomNav activePage="admin" />
            </div>
        </ProtectedRoute>
    );
}