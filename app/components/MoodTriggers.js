"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faBolt } from "@fortawesome/free-solid-svg-icons";

export default function MoodTriggers() {
    const { user } = useAuth();
    const [triggers, setTriggers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasEnoughData, setHasEnoughData] = useState(false);
    const [daysCount, setDaysCount] = useState(0);

    useEffect(() => {
        if (user?.uid) {
            fetchMoodTriggers();
        }
    }, [user]);

    const fetchMoodTriggers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/mood-triggers');

            if (response.ok) {
                const data = await response.json();

                if (data.success) {
                    setTriggers(data.triggers || []);
                    setHasEnoughData(data.hasEnoughData);
                    setDaysCount(data.daysCount || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching mood triggers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Analyzing your patterns...</p>
            </div>
        );
    }

    if (!hasEnoughData) {
        return (
            <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-base font-semibold text-gray-700 mb-2">
                    Chat at least 7 days to get insights
                </div>
                <div className="text-sm text-gray-500 mb-2">
                    Keep chatting to unlock this feature
                </div>
                <div className="text-xs text-gray-400">
                    Current progress: {daysCount}/7 days
                </div>
            </div>
        );
    }

    if (triggers.length === 0) {
        return (
            <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">🌟</div>
                <div className="text-base font-semibold text-gray-700 mb-2">
                    No clear patterns yet
                </div>
                <div className="text-sm text-gray-500">
                    Continue journaling to discover your mood triggers
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faBolt} className="h-5 w-5 text-amber-500" />
                <h4 className="text-sm font-semibold text-gray-700">Your Mood Triggers</h4>
            </div>

            {triggers.map((trigger, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{trigger.emoji}</span>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-800">{trigger.name}</div>
                            <div className="text-xs text-gray-500">{trigger.description}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-gray-200">
                            <div
                                className={`h-2 rounded-full ${trigger.impact >= 70 ? 'bg-red-500' :
                                        trigger.impact >= 40 ? 'bg-orange-500' :
                                            'bg-yellow-500'
                                    }`}
                                style={{ width: `${trigger.impact}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8">{trigger.impact}%</span>
                    </div>
                </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 text-center">
                    💡 These triggers are identified from your journal entries and chat patterns
                </p>
            </div>
        </div>
    );
}
