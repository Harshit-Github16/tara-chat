"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faNewspaper,
    faChartBar,
    faArrowLeft,
    faVideo,
    faTrash,
    faPlus,
    faExternalLinkAlt,
    faEdit,
    faTimes
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
    const { user, loading: authLoading } = useAuth();
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
    const [isClient, setIsClient] = useState(false);
    const [videos, setVideos] = useState([]);
    const [videoForm, setVideoForm] = useState({
        title: '',
        description: '',
        url: '',
        category: 'Wellness'
    });
    const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
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
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/admin/videos');
            const data = await response.json();
            if (Array.isArray(data)) {
                setVideos(data);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        setIsSubmittingVideo(true);
        try {
            const response = await fetch('/api/admin/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(videoForm)
            });
            const data = await response.json();
            if (data.success) {
                setVideoForm({ title: '', description: '', url: '', category: 'Wellness' });
                fetchVideos();
                alert('Video added successfully!');
            } else {
                alert(data.error || 'Failed to add video');
            }
        } catch (error) {
            console.error('Error adding video:', error);
        } finally {
            setIsSubmittingVideo(false);
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        try {
            const response = await fetch(`/api/admin/videos?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                fetchVideos();
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    const handleEditVideo = (video) => {
        setEditingVideo(video);
        setShowEditModal(true);
    };

    const handleUpdateVideo = async (e) => {
        e.preventDefault();
        setIsSubmittingVideo(true);
        try {
            const response = await fetch(`/api/admin/videos?id=${editingVideo._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingVideo)
            });
            const data = await response.json();
            if (data.success) {
                setShowEditModal(false);
                setEditingVideo(null);
                fetchVideos();
                alert('Video updated successfully!');
            } else {
                alert(data.error || 'Failed to update video');
            }
        } catch (error) {
            console.error('Error updating video:', error);
            alert('Failed to update video');
        } finally {
            setIsSubmittingVideo(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (user?.email && !ADMIN_EMAILS.includes(user.email)) {
            window.location.href = "/journal";
        }
    }, [user]);

    useEffect(() => {
        if (user?.email && ADMIN_EMAILS.includes(user.email)) {
            fetchStats();
            fetchUsers();
            fetchVideos();
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

        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
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
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/taralogo.jpg" alt="Tara Logo" className="h-8 w-8 rounded-full object-cover" />
                            <span className="text-lg font-semibold text-rose-600">Tara4u Admin</span>
                        </Link>
                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Videos</p>
                                    <p className="text-3xl font-bold text-gray-800">{videos.length}</p>
                                </div>
                                <div className="bg-rose-100 rounded-full p-4">
                                    <FontAwesomeIcon icon={faVideo} className="h-6 w-6 text-rose-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Admin Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/admin/blog" className="flex items-center justify-between p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faNewspaper} className="h-5 w-5 text-rose-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Manage Blogs</p>
                                        <p className="text-sm text-gray-600">Create and edit blogs</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </Link>
                            <Link href="/admin/analytics" className="flex items-center justify-between p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 text-rose-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">User Analytics</p>
                                        <p className="text-sm text-gray-600">Track user behavior</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </Link>
                            <button onClick={() => document.getElementById('video-management').scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-between p-4 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faVideo} className="h-5 w-5 text-rose-600" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Manage Videos</p>
                                        <p className="text-sm text-gray-600">Latest YouTube links</p>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 text-gray-400 rotate-180" />
                            </button>
                        </div>
                    </div>

                    {/* YouTube Videos Management */}
                    <div id="video-management" className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-rose-100 p-3 rounded-xl">
                                <FontAwesomeIcon icon={faVideo} className="h-5 w-5 text-rose-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Video Upload & Management</h2>
                        </div>

                        <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-rose-50/30 p-4 rounded-xl border border-rose-100/50">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Video Title</label>
                                <input type="text" required placeholder="Enter video title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">YouTube Link</label>
                                <input type="url" required placeholder="https://www.youtube.com/watch?v=..." value={videoForm.url} onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })} className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Category</label>
                                <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })} className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                                    <option value="Wellness">Wellness</option>
                                    <option value="Meditation">Meditation</option>
                                    <option value="Self-Care">Self-Care</option>
                                    <option value="Mental Health">Mental Health</option>
                                    <option value="Anxiety">Anxiety</option>
                                    <option value="Work-Life Balance">Work-Life Balance</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                                <input type="text" placeholder="Short description" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" disabled={isSubmittingVideo} className="w-full md:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmittingVideo ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />}
                                    Add Video
                                </button>
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">

                                        <th className="py-3 px-4 font-semibold">Details</th>
                                        <th className="py-3 px-4 font-semibold">Category</th>
                                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video) => (
                                        <tr key={video._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                                            <td className="py-4 px-4">
                                                <div className="font-bold text-gray-800 text-sm mb-1">{video.title}</div>
                                                <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{video.description}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider">{video.category}</span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEditVideo(video)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit Video">
                                                        <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteVideo(video._id)} className="p-2 text-gray-400 hover:text-rose-600 transition-colors" title="Delete Video">
                                                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {videos.length === 0 && (
                                        <tr><td colSpan="4" className="py-12 text-center text-gray-400 italic">No videos added yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
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
                                <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9 pr-4 py-2 bg-rose-50/50 border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-64" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('totalChats')}>Chats {sortConfig.key === 'totalChats' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('uniqueChatDays')}>Days {sortConfig.key === 'uniqueChatDays' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-center cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('totalTimeSpent')}>Time Spent {sortConfig.key === 'totalTimeSpent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600">Profession</th>
                                        <th className="py-3 px-4 text-sm font-semibold text-gray-600 cursor-pointer hover:text-rose-600 transition-colors" onClick={() => handleSort('createdAt')}>Joined Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-800 font-medium">{user.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <div className="text-sm font-medium">{user.email}</div>
                                                <div className="text-[10px] text-gray-400 capitalize">{user.gender || '-'} • {user.ageRange || '-'} • {user.provider || 'Web'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-center"><span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold text-xs">{user.totalChats || 0}</span></td>
                                            <td className="py-3 px-4 text-center"><span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">{user.uniqueChatDays || 0}</span></td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="text-sm font-bold text-gray-700">{formatTimeSpent(user.totalTimeSpent)}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">{user.profession || '-'}</td>
                                            <td className="py-3 px-4 text-gray-500 text-sm whitespace-nowrap">{user.createdAt ? new Date(user.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                                        </tr>
                                    ))}
                                    {currentUsers.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-gray-400 italic">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                    {loading && (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center">
                                                <div className="flex justify-center flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin"></div>
                                                    <span className="text-xs text-rose-600 font-bold tracking-widest uppercase">Fetching Users...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 border-t border-rose-50 pt-6">
                                <div className="text-sm text-gray-500 order-2 sm:order-1">
                                    Showing <span className="font-semibold text-gray-700">{indexOfFirstUser + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(indexOfLastUser, filteredAndSortedUsers.length)}</span> of <span className="font-semibold text-gray-700">{filteredAndSortedUsers.length}</span> users
                                </div>
                                <div className="flex items-center gap-2 order-1 sm:order-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-rose-100 text-gray-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Previous Page"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => paginate(page)}
                                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page
                                                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-200 scale-110'
                                                            : 'text-gray-500 hover:bg-rose-50 hover:text-rose-600'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page} className="px-1 text-gray-400">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-rose-100 text-gray-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Next Page"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav activePage="admin" />

                {/* Edit Video Modal */}
                {showEditModal && editingVideo && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white border-b border-rose-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Edit Video</h2>
                                        <p className="text-xs text-gray-400">Update video details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateVideo} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Video Title *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter video title"
                                        value={editingVideo.title}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">YouTube Link *</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={editingVideo.url}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, url: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Category</label>
                                    <select
                                        value={editingVideo.category}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="Wellness">Wellness</option>
                                        <option value="Meditation">Meditation</option>
                                        <option value="Self-Care">Self-Care</option>
                                        <option value="Mental Health">Mental Health</option>
                                        <option value="Anxiety">Anxiety</option>
                                        <option value="Work-Life Balance">Work-Life Balance</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                                    <textarea
                                        placeholder="Short description"
                                        value={editingVideo.description || ''}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-rose-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[100px] resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-rose-50">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingVideo}
                                        className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmittingVideo ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                                                Update Video
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
