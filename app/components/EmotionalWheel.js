"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { useInsights } from "../contexts/InsightsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTimes, faCheckCircle, faLock, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import LifeAreaQuiz from "./LifeAreaQuiz";

// Radar Chart Component
function RadarChartView({ quizResults, lifeAreas }) {
    // Soft, light colors for each life area matching the theme
    const centerX = 200;
    const centerY = 200;
    const maxRadius = 140;
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
            labelX: centerX + (maxRadius + 50) * Math.cos(angle),
            labelY: centerY + (maxRadius + 50) * Math.sin(angle),
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

    return (
        <div className="relative w-full">
            <svg
                viewBox="0 0 400 400"
                className="w-full h-auto"
                style={{ maxHeight: '350px' }}
            >
                {/* Grid circles */}
                {gridLevels.map((level) => {
                    const r = (level / 100) * maxRadius;
                    return (
                        <g key={level}>
                            <circle
                                cx={centerX}
                                cy={centerY}
                                r={r}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="1"
                            />
                            {/* Level labels */}
                            <text
                                x={centerX + 5}
                                y={centerY - r - 5}
                                className="text-xs fill-gray-400"
                                fontSize="10"
                            >
                                {level}%
                            </text>
                        </g>
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
                        strokeWidth="2.5"
                    />
                )}

                {/* Data points */}
                {points.map((point, index) => (
                    <circle
                        key={`point-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill={point.score > 0 ? "rgb(244, 63, 94)" : "#d1d5db"}
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}

                {/* Labels */}
                {points.map((point, index) => {
                    // Calculate text anchor based on position
                    let textAnchor = 'middle';
                    if (point.labelX < centerX - 10) textAnchor = 'end';
                    if (point.labelX > centerX + 10) textAnchor = 'start';

                    const shortLabel = point.area.length > 15
                        ? point.area.substring(0, 12) + '...'
                        : point.area;

                    return (
                        <text
                            key={`label-${index}`}
                            x={point.labelX}
                            y={point.labelY}
                            textAnchor={textAnchor}
                            className="text-xs font-semibold fill-gray-700"
                            dominantBaseline="middle"
                            fontSize="11"
                        >
                            {shortLabel}
                        </text>
                    );
                })}

                {/* Center icon */}
                <foreignObject
                    x={centerX - 20}
                    y={centerY - 20}
                    width="40"
                    height="40"
                >
                    <div className="flex items-center justify-center w-full h-full">
                        <FontAwesomeIcon icon={faChartPie} className="text-rose-500 text-2xl" />
                    </div>
                </foreignObject>
            </svg>
        </div>
    );
}


export default function EmotionalWheel() {
    const { quizResults: contextQuizResults, loading: contextLoading } = useInsights();
    const [lifeAreas, setLifeAreas] = useState([]);
    const [quizResults, setQuizResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showQuizList, setShowQuizList] = useState(false);

    useEffect(() => {
        if (contextQuizResults) {
            setLifeAreas(contextQuizResults.lifeAreas || []);
            setQuizResults(contextQuizResults.quizResults || {});
            setLoading(false);
        } else if (!contextLoading) {
            setLoading(false);
        }
    }, [contextQuizResults, contextLoading]);

    const handleStartQuiz = (area) => {
        setSelectedArea(area);
        setShowQuiz(true);
        setShowQuizList(false);
    };

    const handleQuizComplete = (area, score) => {
        setQuizResults(prev => ({
            ...prev,
            [area]: { score }
        }));
        setShowQuiz(false);
        setSelectedArea(null);

        // Check if all quizzes are completed
        const allCompleted = lifeAreas.every(area => quizResults[area] || area === selectedArea);
        if (!allCompleted) {
            setShowQuizList(true);
        }
    };

    const hasLifeAreas = lifeAreas.length > 0;
    const hasAnyQuizResults = Object.keys(quizResults).length > 0;
    const allQuizzesCompleted = hasLifeAreas && lifeAreas.every(area => quizResults[area]);

    return (
        <>
            {/* Radar Chart Visualization */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            ) : (
                <>
                    {hasLifeAreas ? (
                        <RadarChartView quizResults={quizResults} lifeAreas={lifeAreas} />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-4">Please complete onboarding to select your life areas</p>
                        </div>
                    )}

                    {/* Get Report Button - Always show */}
                    <button
                        onClick={() => hasLifeAreas ? setShowQuizList(true) : alert('Please complete onboarding first')}
                        disabled={!hasLifeAreas}
                        className={`w-full mt-4 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-3 ${hasLifeAreas
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
                        {hasLifeAreas
                            ? (hasAnyQuizResults ? 'Update Report' : 'Get Report')
                            : 'Complete Onboarding First'
                        }
                    </button>
                </>
            )}

            {/* Quiz List Modal */}
            {showQuizList && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Life Areas Assessment</h2>
                            <button
                                onClick={() => setShowQuizList(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                            <p className="text-gray-600 text-sm mb-4">
                                Complete quizzes for each life area to generate your personalized report
                            </p>

                            {/* Life Areas List */}
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
                                                onClick={() => handleStartQuiz(area)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${hasCompleted
                                                    ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                                                    : 'bg-rose-500 text-white hover:bg-rose-600'
                                                    }`}
                                            >
                                                {hasCompleted ? 'Retake' : 'Start'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress Info */}
                            <div className="mt-6 p-4 bg-rose-50 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm font-bold text-rose-600">
                                        {Object.keys(quizResults).length} / {lifeAreas.length}
                                    </span>
                                </div>
                                <div className="w-full bg-rose-200 rounded-full h-2">
                                    <div
                                        className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(Object.keys(quizResults).length / lifeAreas.length) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quiz Modal */}
            {showQuiz && selectedArea && (
                <LifeAreaQuiz
                    lifeArea={selectedArea}
                    onComplete={handleQuizComplete}
                    onClose={() => {
                        setShowQuiz(false);
                        setSelectedArea(null);
                        setShowQuizList(true);
                    }}
                />
            )}
        </>
    );
}
