"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faNewspaper,
    faChartBar,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com",
    "disha.nowawave@gmail.com"
];

export default function AdminPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBlogs: 0,
        totalChats: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('joinDate'); // 'timeSpent', 'sessions', 'joinDate', 'name'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const usersPerPage = 10;

    // Helper function to format time
    const formatTime = (milliseconds) => {
        if (!milliseconds || milliseconds === 0) return '0m';

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
        // distinct loading state for stats could be separate, but this is fine
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            console.log('Fetched Users:', data); // Debugging
            if (data.success && Array.isArray(data.data)) {
                // Fetch analytics data for each user
                const usersWithAnalytics = await Promise.all(
                    data.data.map(async (user) => {
                        try {
                            const analyticsResponse = await fetch(`/api/admin/user-analytics/${user.firebaseUid}`, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                }
                            });
                            console.log(`Analytics response for ${user.name}:`, analyticsResponse.status);
                            if (analyticsResponse.ok) {
                                const analyticsData = await analyticsResponse.json();
                                console.log(`Analytics data for ${user.name}:`, analyticsData);
                                return {
                                    ...user,
                                    analytics: analyticsData.success ? analyticsData.data : {
                                        totalTimeSpent: 0,
                                        sessionCount: 0,
                                        lastActive: null
                                    }
                                };
                            } else {
                                const errorText = await analyticsResponse.text();
                                console.error(`Failed to fetch analytics for ${user.name}:`, errorText);
                            }
                        } catch (error) {
                            console.error('Error fetching analytics for user:', user.firebaseUid, error);
                        }
                        return {
                            ...user,
                            analytics: {
                                totalTimeSpent: 0,
                                sessionCount: 0,
                                lastActive: null
                            }
                        };
                    })
                );
                setUsers(usersWithAnalytics);
            } else {
                console.error('Users data is not an array:', data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check if user is admin
        if (user?.email && !ADMIN_EMAILS.includes(user.email)) {
            window.location.href = "/journal";
        }
    }, [user]);

    useEffect(() => {
        if (user?.email && ADMIN_EMAILS.includes(user.email)) {
            fetchStats();
            fetchUsers();
        }
    }, [user]);

    // Pagination Logic
    const safeUsers = Array.isArray(users) ? users : [];

    // Sort users based on selected criteria
    const sortedUsers = [...safeUsers].sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'timeSpent':
                aValue = a.analytics?.totalTimeSpent || 0;
                bValue = b.analytics?.totalTimeSpent || 0;
                break;
            case 'sessions':
                aValue = a.analytics?.sessionCount || 0;
                bValue = b.analytics?.sessionCount || 0;
                break;
            case 'joinDate':
                aValue = new Date(a.createdAt || 0);
                bValue = new Date(b.createdAt || 0);
                break;
            case 'name':
                aValue = (a.name || '').toLowerCase();
                bValue = (b.name || '').toLowerCase();
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

    const handleSort = (criteria) => {
        if (sortBy === criteria) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(criteria);
            setSortOrder('desc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara4u Admin</span>
                        </Link>

                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1     px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                                </div>
                                <div className="bg-rose-100 rounded-full p-4">
                                    <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-rose-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Blogs</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalBlogs}</p>
                                </div>
                                <div className="bg-rose-100 rounded-full p-4">
                                    <FontAwesomeIcon icon={faNewspaper} className="h-6 w-6 text-rose-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Chats</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.totalChats}</p>
                                </div>
                                <div className="bg-rose-100 rounded-full p-4">
                                    <FontAwesomeIcon icon={faChartBar} className="h-6 w-6 text-rose-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Admin Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/admin/blog"
                                className="flex items-center justify-between p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faNewspaper} className="h-5 w-5 text-rose-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Manage Blogs</p>
                                        <p className="text-sm text-gray-600">Create, edit, and delete blog posts</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </Link>

                            <Link
                                href="/admin/analytics"
                                className="flex items-center justify-between p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-rose-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">User Analytics</p>
                                        <p className="text-sm text-gray-600">View user engagement and time tracking data</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </Link>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-8 mt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">All Users ({sortedUsers.length})</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">
                                    Sorted by: {sortBy === 'timeSpent' ? 'Time Spent' :
                                        sortBy === 'sessions' ? 'Sessions' :
                                            sortBy === 'joinDate' ? 'Join Date' : 'Name'}
                                    ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                                </span>
                                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Details</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Profession</th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('timeSpent')}
                                        >
                                            Time Spent {sortBy === 'timeSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('sessions')}
                                        >
                                            Sessions {sortBy === 'sessions' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Source</th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('joinDate')}
                                        >
                                            Joined Date {sortBy === 'joinDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-800 font-medium">{user.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <div className="text-sm">
                                                    <span className="capitalize">{user.gender || '-'}</span>
                                                    {(user.gender && user.ageRange) && (<span> • </span>)}
                                                    <span>{user.ageRange || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">{user.profession || '-'}</td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    {user.analytics ? (
                                                        <>
                                                            <div className="font-semibold text-rose-600">
                                                                {formatTime(user.analytics.totalTimeSpent || 0)}
                                                            </div>
                                                            {user.analytics.lastActive && (
                                                                <div className="text-xs text-gray-500">
                                                                    Last: {new Date(user.analytics.lastActive).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">Loading...</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    {user.analytics ? (
                                                        <>
                                                            <div className="font-semibold text-blue-600">
                                                                {user.analytics.sessionCount || 0}
                                                            </div>
                                                            {user.analytics.sessionCount > 0 && (
                                                                <div className="text-xs text-gray-500">
                                                                    Avg: {formatTime((user.analytics.totalTimeSpent || 0) / user.analytics.sessionCount)}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">Loading...</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.source === 'whatsapp'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {user.source || user.provider || 'Web'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                    {safeUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {safeUsers.length > usersPerPage && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                        }`}
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                                ? 'bg-rose-600 text-white'
                                                : 'text-gray-600 hover:bg-rose-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === totalPages
                                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <BottomNav activePage="admin" />
            </div>
        </ProtectedRoute>
    );
}
