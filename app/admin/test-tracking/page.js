"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { usePageTracking } from "../../hooks/usePageTracking";
import { useAuth } from "../../contexts/AuthContext";
import TrackPageView from "../../components/TrackPageView";

export default function TestTrackingPage() {
    const { user } = useAuth();
    const { trackEvent, sessionId } = usePageTracking('/admin/test-tracking');
    const [logs, setLogs] = useState([]);
    const [isTracking, setIsTracking] = useState(false);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    const testDatabaseConnection = async () => {
        try {
            const response = await fetch('/api/analytics/test');
            const data = await response.json();
            if (data.success) {
                addLog(`Database test successful: ${data.collections.length} collections found`);
            } else {
                addLog(`Database test failed: ${data.message}`);
            }
        } catch (error) {
            addLog(`Database test error: ${error.message}`);
        }
    };

    const debugTrackingData = async () => {
        try {
            const response = await fetch('/api/analytics/debug');
            const data = await response.json();
            if (data.success) {
                addLog(`Debug: ${data.data.totalRecords} records found`);
                addLog(`Pages tracked: ${data.data.uniquePages.join(', ')}`);
                addLog(`Users: ${data.data.uniqueUsers.length} unique users`);
                addLog(`Actions: Enter=${data.data.summary.actions.enter}, Exit=${data.data.summary.actions.exit}`);
            } else {
                addLog(`Debug failed: ${data.error}`);
            }
        } catch (error) {
            addLog(`Debug error: ${error.message}`);
        }
    };

    const testCustomEvent = () => {
        if (trackEvent) {
            trackEvent('custom_test', { testData: 'Manual test event' });
            addLog('Custom test event sent');
        } else {
            addLog('trackEvent not available - user may not be logged in');
        }
    };

    const startTracking = () => {
        setIsTracking(true);
        addLog('Started manual tracking test');
    };

    const stopTracking = () => {
        setIsTracking(false);
        addLog('Stopped manual tracking test');
    };

    useEffect(() => {
        if (user?.email) {
            addLog(`Page loaded for user: ${user.email}`);
            addLog(`Session ID: ${sessionId}`);
        } else {
            addLog('Page loaded - user not logged in');
        }
    }, [user, sessionId]);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <TrackPageView pageName="/admin/test-tracking" />
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                        </Link>
                        <span className="text-lg font-semibold text-rose-600">Tracking Test</span>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Tracking Status</h2>
                        <div className="space-y-2">
                            <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
                            <p><strong>Session ID:</strong> {sessionId}</p>
                            <p><strong>Page:</strong> /admin/test-tracking</p>
                            <p><strong>Status:</strong>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user?.uid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {user?.uid ? 'Tracking Active' : 'Not Tracking'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Test Controls</h2>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={testDatabaseConnection}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Test Database
                            </button>
                            <button
                                onClick={debugTrackingData}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Debug Data
                            </button>
                            <button
                                onClick={testCustomEvent}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                            >
                                Send Test Event
                            </button>
                            <button
                                onClick={startTracking}
                                disabled={isTracking}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                                Start Test
                            </button>
                            <button
                                onClick={stopTracking}
                                disabled={!isTracking}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <FontAwesomeIcon icon={faStop} className="mr-2" />
                                Stop Test
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Activity Log</h2>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                            {logs.length > 0 ? (
                                <div className="space-y-1">
                                    {logs.map((log, index) => (
                                        <div key={index} className="text-sm font-mono text-gray-700">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No activity yet...</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Instructions</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>• This page automatically tracks your visit when you arrive</p>
                            <p>• Move your mouse, scroll, or click to generate activity</p>
                            <p>• Heartbeat events are sent every 30 seconds while active</p>
                            <p>• Exit events are tracked when you leave the page</p>
                            <p>• Check the Analytics dashboard to see the data</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}