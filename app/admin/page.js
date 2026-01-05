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
    "ruchika.dave91@gmail.com"
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
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const usersPerPage = 10;

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
                setUsers(data.data);
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and Sort Logic
    const filteredAndSortedUsers = Array.isArray(users) ? users
        .filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortConfig.key) {
                const aVal = a[sortConfig.key] || 0;
                const bVal = b[sortConfig.key] || 0;
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }) : [];

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

    const formatTimeSpent = (ms) => {
        if (!ms || ms < 0) return '0m';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        if (minutes > 0) {
            return `${minutes}m`;
        }
        return `${seconds}s`;
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
                                        <p className="text-sm text-gray-600">Track user behavior, page views, and journeys</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </Link>


                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-8 mt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">All Users Analytics ({filteredAndSortedUsers.length})</h2>
                                <p className="text-xs text-gray-400">Page {currentPage} of {totalPages}</p>
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 pr-4 py-2 bg-rose-50/50 border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-64"
                                />
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
                                            Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 text-center cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('totalChats')}
                                        >
                                            Chats {sortConfig.key === 'totalChats' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 text-center cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('totalTimeSpent')}
                                        >
                                            Time Spent {sortConfig.key === 'totalTimeSpent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Profession</th>
                                        <th
                                            className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            Joined Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-800 font-medium">{user.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <div className="text-sm font-medium">{user.email}</div>
                                                <div className="text-[10px] text-gray-400 capitalize">
                                                    {user.gender || '-'} • {user.ageRange || '-'} • {user.source || user.provider || 'Web'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold text-xs">
                                                    {user.totalChats || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="text-sm font-bold text-gray-700">
                                                    {formatTimeSpent(user.totalTimeSpent)}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    Avg: {formatTimeSpent(user.totalTimeSpent / (user.sessionCount || 1))}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">{user.profession || '-'}</td>
                                            <td className="py-3 px-4 text-gray-500 text-sm whitespace-nowrap">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                    {currentUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No users matching your search
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {filteredAndSortedUsers.length > usersPerPage && (
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
