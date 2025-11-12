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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (user?.email && !ADMIN_EMAILS.includes(user.email)) {
            window.location.href = "/journal";
        }
    }, [user]);

    useEffect(() => {
        if (user?.email && ADMIN_EMAILS.includes(user.email)) {
            fetchStats();
        }
    }, [user]);

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
        } finally {
            setLoading(false);
        }
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
                            <span className="text-lg font-semibold text-rose-600">Tara Admin</span>
                        </Link>

                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.name || user?.email}</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                        </div>
                    </div>
                </main>

                <BottomNav activePage="admin" />
            </div>
        </ProtectedRoute>
    );
}
