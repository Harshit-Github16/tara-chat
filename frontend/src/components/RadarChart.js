"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import LifeAreaQuiz from "./LifeAreaQuiz";

export default function RadarChart() {
    const [lifeAreas, setLifeAreas] = useState([]);
    const [quizResults, setQuizResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        fetchQuizData();
    }, []);

    const fetchQuizData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/quiz/results');

            if (response.ok) {
                const data = await response.json();
                setLifeAreas(data.lifeAreas || []);
                setQuizResults(data.quizResults || {});
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckNow = (area) => {
        setSelectedArea(area);
        setShowQuiz(true);
    };

    const handleQuizComplete = (area, score) => {
        setQuizResults(prev => ({
            ...prev,
            [area]: { score }
        }));
        setShowQuiz(false);
        setSelectedArea(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (lifeAreas.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
                <div className="text-center px-4">
                    <div className="text-4xl mb-3">📊</div>
                    <div className="text-base font-semibold text-gray-700 mb-2">
                        No Life Areas Selected
                    </div>
                    <div className="text-sm text-gray-500">
                        Complete onboarding to select your life areas
                    </div>
                </div>
            </div>
        );
    }

    // Calculate radar chart points
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 150;
    const numAreas = lifeAreas.length;
    const angleStep = (2 * Math.PI) / numAreas;

    // Create points for each life area
    const points = lifeAreas.map((area, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const score = quizResults[area]?.score || 0;
        const radius = (score / 100) * maxRadius;

        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            labelX: centerX + (maxRadius + 40) * Math.cos(angle),
            labelY: centerY + (maxRadius + 40) * Math.sin(angle),
            area,
            score,
            angle
        };
    });

    // Create path for filled area
    const pathData = points.length > 0
        ? `M ${points[0].x} ${points[0].y} ` +
        points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
        ' Z'
        : '';

    // Create grid circles
    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className="space-y-6">
            {/* SVG Radar Chart */}
            <div className="relative">
                <svg
                    viewBox="0 0 400 400"
                    className="w-full h-auto"
                    style={{ maxHeight: '400px' }}
                >
                    {/* Grid circles */}
                    {gridLevels.map((level) => {
                        const r = (level / 100) * maxRadius;
                        return (
                            <circle
                                key={level}
                                cx={centerX}
                                cy={centerY}
                                r={r}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Grid lines from center to each point */}
                    {points.map((point, index) => (
                        <line
                            key={`line-${index}`}
                            x1={centerX}
                            y1={centerY}
                            x2={centerX + maxRadius * Math.cos(point.angle)}
                            y2={centerY + maxRadius * Math.sin(point.angle)}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Filled area */}
                    {pathData && (
                        <path
                            d={pathData}
                            fill="rgba(244, 63, 94, 0.2)"
                            stroke="rgb(244, 63, 94)"
                            strokeWidth="2"
                        />
                    )}

                    {/* Data points */}
                    {points.map((point, index) => (
                        <circle
                            key={`point-${index}`}
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill={point.score > 0 ? "rgb(244, 63, 94)" : "#d1d5db"}
                        />
                    ))}

                    {/* Labels */}
                    {points.map((point, index) => {
                        // Calculate text anchor based on position
                        let textAnchor = 'middle';
                        if (point.labelX < centerX - 10) textAnchor = 'end';
                        if (point.labelX > centerX + 10) textAnchor = 'start';

                        return (
                            <text
                                key={`label-${index}`}
                                x={point.labelX}
                                y={point.labelY}
                                textAnchor={textAnchor}
                                className="text-xs font-medium fill-gray-700"
                                dominantBaseline="middle"
                            >
                                {point.area}
                            </text>
                        );
                    })}

                    {/* Center label */}
                    <text
                        x={centerX}
                        y={centerY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-gray-400"
                    >
                        0%
                    </text>
                </svg>
            </div>

            {/* Life Areas List with Check Now buttons */}
            <div className="space-y-3">
                {lifeAreas.map((area) => {
                    const result = quizResults[area];
                    const hasCompleted = result && result.score !== undefined;

                    return (
                        <div
                            key={area}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {hasCompleted ? (
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="h-5 w-5 text-green-500"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="h-5 w-5 text-gray-400"
                                    />
                                )}
                                <div>
                                    <div className="font-medium text-gray-900">{area}</div>
                                    {hasCompleted && (
                                        <div className="text-sm text-gray-500">
                                            Score: {result.score}%
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleCheckNow(area)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${hasCompleted
                                    ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                    : 'bg-rose-500 text-white hover:bg-rose-600'
                                    }`}
                            >
                                {hasCompleted ? 'Retake' : 'Check Now'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Quiz Modal */}
            {showQuiz && selectedArea && (
                <LifeAreaQuiz
                    lifeArea={selectedArea}
                    onComplete={handleQuizComplete}
                    onClose={() => {
                        setShowQuiz(false);
                        setSelectedArea(null);
                    }}
                />
            )}
        </div>
    );
}
