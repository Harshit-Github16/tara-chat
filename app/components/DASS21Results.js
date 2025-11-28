"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faCalendar, faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import DASS21Suggestions from "./DASS21Suggestions";

export default function DASS21Results() {
    const router = useRouter();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch("/api/dass21?limit=5", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAssessments(data.data.assessments || []);
            }
        } catch (error) {
            console.error("Error fetching DASS-21 assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityLevel = (score, category) => {
        const ranges = {
            depression: [
                { max: 9, level: "Normal", color: "text-green-600", bg: "bg-green-50" },
                { max: 13, level: "Mild", color: "text-yellow-600", bg: "bg-yellow-50" },
                { max: 20, level: "Moderate", color: "text-orange-600", bg: "bg-orange-50" },
                { max: 27, level: "Severe", color: "text-red-600", bg: "bg-red-50" },
                { max: Infinity, level: "Extremely Severe", color: "text-red-800", bg: "bg-red-100" }
            ],
            anxiety: [
                { max: 7, level: "Normal", color: "text-green-600", bg: "bg-green-50" },
                { max: 9, level: "Mild", color: "text-yellow-600", bg: "bg-yellow-50" },
                { max: 14, level: "Moderate", color: "text-orange-600", bg: "bg-orange-50" },
                { max: 19, level: "Severe", color: "text-red-600", bg: "bg-red-50" },
                { max: Infinity, level: "Extremely Severe", color: "text-red-800", bg: "bg-red-100" }
            ],
            stress: [
                { max: 14, level: "Normal", color: "text-green-600", bg: "bg-green-50" },
                { max: 18, level: "Mild", color: "text-yellow-600", bg: "bg-yellow-50" },
                { max: 25, level: "Moderate", color: "text-orange-600", bg: "bg-orange-50" },
                { max: 33, level: "Severe", color: "text-red-600", bg: "bg-red-50" },
                { max: Infinity, level: "Extremely Severe", color: "text-red-800", bg: "bg-red-100" }
            ]
        };

        return ranges[category].find(range => score <= range.max);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin" />
                <p className="text-gray-500 mt-2">Loading assessments...</p>
            </div>
        );
    }

    if (assessments.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                    <FontAwesomeIcon icon={faClipboardList} className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assessments Yet</h3>
                <p className="text-gray-600 mb-4">
                    Take your first DASS-21 assessment to track your mental wellness
                </p>
                <button
                    onClick={() => router.push("/dass21")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                    Take Assessment
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </button>
            </div>
        );
    }

    const latestAssessment = assessments[0];
    const depressionSeverity = getSeverityLevel(latestAssessment.scores.depression, "depression");
    const anxietySeverity = getSeverityLevel(latestAssessment.scores.anxiety, "anxiety");
    const stressSeverity = getSeverityLevel(latestAssessment.scores.stress, "stress");

    return (
        <div className="space-y-6">
            {/* Latest Assessment */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Latest Assessment</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                        {formatDate(latestAssessment.completedAt)}
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Depression */}
                    <div className={`p-4 rounded-xl ${depressionSeverity.bg} border border-gray-200`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">Depression</span>
                            <span className={`text-lg font-bold ${depressionSeverity.color}`}>
                                {latestAssessment.scores.depression}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${depressionSeverity.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${Math.min((latestAssessment.scores.depression / 42) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs font-semibold ${depressionSeverity.color}`}>
                                {depressionSeverity.level}
                            </span>
                        </div>
                    </div>

                    {/* Anxiety */}
                    <div className={`p-4 rounded-xl ${anxietySeverity.bg} border border-gray-200`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">Anxiety</span>
                            <span className={`text-lg font-bold ${anxietySeverity.color}`}>
                                {latestAssessment.scores.anxiety}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${anxietySeverity.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${Math.min((latestAssessment.scores.anxiety / 42) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs font-semibold ${anxietySeverity.color}`}>
                                {anxietySeverity.level}
                            </span>
                        </div>
                    </div>

                    {/* Stress */}
                    <div className={`p-4 rounded-xl ${stressSeverity.bg} border border-gray-200`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">Stress</span>
                            <span className={`text-lg font-bold ${stressSeverity.color}`}>
                                {latestAssessment.scores.stress}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${stressSeverity.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${Math.min((latestAssessment.scores.stress / 42) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs font-semibold ${stressSeverity.color}`}>
                                {stressSeverity.level}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment History */}
            {assessments.length > 1 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Previous Assessments</h4>
                    <div className="space-y-2">
                        {assessments.slice(1, 5).map((assessment, index) => (
                            <div key={assessment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">{formatDate(assessment.completedAt)}</span>
                                    <div className="flex gap-3">
                                        <span className="text-gray-700">
                                            D: <span className="font-semibold">{assessment.scores.depression}</span>
                                        </span>
                                        <span className="text-gray-700">
                                            A: <span className="font-semibold">{assessment.scores.anxiety}</span>
                                        </span>
                                        <span className="text-gray-700">
                                            S: <span className="font-semibold">{assessment.scores.stress}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Take New Assessment Button */}
            <button
                onClick={() => router.push("/dass21")}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
                Take New Assessment
            </button>

            {/* Personalized Suggestions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <DASS21Suggestions scores={latestAssessment.scores} />
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-gray-700 leading-relaxed">
                    💡 Regular assessments help track your mental wellness over time.
                    We recommend taking the DASS-21 every 2-4 weeks to monitor changes.
                </p>
            </div>
        </div>
    );
}
