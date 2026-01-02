"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function TrackingDebug() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const addLog = (message) => {
        if (!isClient) return;
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-4), `[${timestamp}] ${message}`]);
    };

    useEffect(() => {
        if (isClient && user?.uid && pathname) {
            addLog(`User: ${user.email}`);
            addLog(`Page: ${pathname}`);
        }
    }, [isClient, user?.uid, pathname]);

    // Show debug panel only for admin users
    const ADMIN_EMAILS = [
        "harshit0150@gmail.com",
        "hello.tara4u@gmail.com",
        "ruchika.dave91@gmail.com"
    ];

    if (!isClient || !user?.email || !ADMIN_EMAILS.includes(user.email)) {
        return null;
    }

    const getSessionId = () => {
        try {
            return sessionStorage.getItem('tara_session_id')?.slice(-8) || 'N/A';
        } catch {
            return 'N/A';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-rose-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-rose-700 transition-colors"
            >
                {isVisible ? 'Hide' : 'Debug'}
            </button>

            {isVisible && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-64 overflow-y-auto">
                    <h3 className="font-semibold text-gray-800 mb-2">Tracking Debug</h3>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-600">User: {user?.email}</p>
                        <p className="text-xs text-gray-600">Page: {pathname}</p>
                        <p className="text-xs text-gray-600">Session: {getSessionId()}</p>
                    </div>
                    <div className="mt-3 space-y-1">
                        {logs.map((log, index) => (
                            <div key={index} className="text-xs font-mono text-gray-700 bg-gray-50 p-1 rounded">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}