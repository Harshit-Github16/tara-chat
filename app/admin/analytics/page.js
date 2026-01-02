'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faUsers,
    faChartLine,
    faEye,
    faMousePointer,
    faCalendarDay,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons';

export default function AdminAnalytics() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(30);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/analytics?days=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAnalyticsData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-gray-600">No analytics data available</p>
                    </div>
                </div>
            </div>
        );
    }

    const { overview, topUsers, dailyStats, pageStats, actionStats } = analyticsData;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">User Analytics Dashboard</h1>

                    {/* Time Range Selector */}
                    <div className="flex gap-2">
                        {[7, 30, 90].map(days => (
                            <button
                                key={days}
                                onClick={() => setTimeRange(days)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === days
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Last {days} days
                            </button>
                        ))}

                        {/* Test Button */}
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch('/api/test-analytics', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                        }
                                    });
                                    if (response.ok) {
                                        alert('Test data created! Refreshing...');
                                        fetchAnalytics();
                                    } else {
                                        alert('Failed to create test data');
                                    }
                                } catch (error) {
                                    console.error('Test error:', error);
                                    alert('Error creating test data');
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
                        >
                            Create Test Data
                        </button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{overview.totalUsers}</p>
                            </div>
                            <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Active in last {timeRange} days</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Time Spent</p>
                                <p className="text-2xl font-bold text-gray-900">{formatTime(overview.totalTimeSpent)}</p>
                            </div>
                            <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Across all users</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                                <p className="text-2xl font-bold text-gray-900">{formatTime(overview.averageSessionTime)}</p>
                            </div>
                            <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Per session</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                <p className="text-2xl font-bold text-gray-900">{overview.totalSessions}</p>
                            </div>
                            <FontAwesomeIcon icon={faEye} className="h-8 w-8 text-orange-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">All user sessions</p>
                    </div>
                </div>

                {/* Top Users by Time Spent */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
                        <div className="space-y-4">
                            {topUsers.slice(0, 10).map((user, index) => (
                                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-rose-600">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatTime(user.totalTimeSpent)}</p>
                                        <p className="text-sm text-gray-500">{user.sessionCount} sessions</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Popular Pages */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Pages</h3>
                        <div className="space-y-4">
                            {Object.entries(pageStats).slice(0, 8).map(([page, stats], index) => (
                                <div key={page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{page}</p>
                                            <p className="text-sm text-gray-500">{stats.visits} visits</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatTime(stats.totalTime)}</p>
                                        <p className="text-sm text-gray-500">avg: {formatTime(stats.totalTime / stats.visits)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Activity Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {Object.entries(dailyStats).slice(-7).map(([date, stats]) => (
                            <div key={date} className="text-center">
                                <div className="text-xs text-gray-500 mb-2">{formatDate(date)}</div>
                                <div className="bg-rose-100 rounded-lg p-3">
                                    <div className="text-sm font-semibold text-rose-600">{stats.sessions}</div>
                                    <div className="text-xs text-gray-500">sessions</div>
                                    <div className="text-xs text-rose-500 mt-1">{formatTime(stats.timeSpent)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(actionStats).map(([action, count]) => (
                            <div key={action} className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900">{count}</div>
                                <div className="text-sm text-gray-600 capitalize">{action.replace('_', ' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}