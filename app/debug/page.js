"use client";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function DebugPage() {
    const { user, loading, checkAuth } = useAuth();
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Debug Page</h1>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">Auth State</h2>
                <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
                {user && (
                    <>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Onboarding Complete:</strong> {user.isOnboardingComplete ? 'Yes' : 'No'}</p>
                    </>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">localStorage</h2>
                <p><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('authToken') ? 'Present' : 'Missing'}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-semibold mb-2">Current Path</h2>
                <p><strong>Path:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}</p>
                <p><strong>Refresh Count:</strong> {refreshCount}s</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Actions</h2>
                <button
                    onClick={checkAuth}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Refresh Auth
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem('authToken');
                        window.location.reload();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Clear Token & Reload
                </button>
            </div>
        </div>
    );
}