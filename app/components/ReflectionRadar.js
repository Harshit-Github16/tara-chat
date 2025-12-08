"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faArrowRight, faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ReflectionRadar({ userId }) {
    const canvasRef = useRef(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScores, setQuizScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Questions for each life domain (3 questions each)
    const lifeAreaQuestions = [
        // Family questions
        { area: 'family', text: 'I feel emotionally supported by my family.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'family', text: 'I am able to communicate openly with my family members.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'family', text: 'My family relationships feel stable and respectful.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Health questions
        { area: 'health', text: 'I feel physically energetic throughout the day.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'health', text: 'I maintain healthy routines (sleep, food, hydration) most days.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'health', text: 'I recover well after stress or tiredness.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Personal Growth questions
        { area: 'personalGrowth', text: 'I feel I am learning, improving, or evolving as a person.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'personalGrowth', text: 'I have goals that give me a sense of direction.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'personalGrowth', text: 'I take time to reflect and understand myself better.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Love & Relationships questions
        { area: 'relationships', text: 'I feel emotionally connected to my partner / close relationships.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'relationships', text: 'I am able to express my needs honestly in relationships.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'relationships', text: 'I feel valued, respected, and understood by people close to me.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Career questions
        { area: 'career', text: 'My work gives me a sense of purpose or progress.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'career', text: 'I feel confident in my skills and ability to handle work situations.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'career', text: 'I experience a healthy balance between work and personal life.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Social Life questions
        { area: 'socialLife', text: 'I have people I can talk to or meet when I need connection.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'socialLife', text: 'I feel a sense of belonging within my social circle.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'socialLife', text: 'I enjoy the quality of my interactions with friends or peers.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Spirituality / Inner Peace questions
        { area: 'spirituality', text: 'I feel connected to something greater (purpose, values, faith, nature).', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'spirituality', text: 'I take moments to slow down, breathe, or be mindful.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'spirituality', text: 'I often feel inner peace or grounding.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },

        // Financial Growth / Stability questions
        { area: 'financial', text: 'I feel in control of my money and financial decisions.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'financial', text: 'I am able to manage expenses without constant stress.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] },
        { area: 'financial', text: 'I am making progress toward my financial goals.', options: ['Strongly Agree', 'Agree', 'Disagree', 'Strongly Disagree'] }
    ];

    // Calculate default scores (all 0 if no quiz data)
    const calculateDefaultScores = () => {
        return {
            family: 0,
            health: 0,
            personalGrowth: 0,
            relationships: 0,
            career: 0,
            socialLife: 0,
            spirituality: 0,
            financial: 0
        };
    };

    // Calculate scores from quiz if available, otherwise default to 0
    const calculateQuizScores = () => {
        if (!quizAnswers || Object.keys(quizAnswers).length === 0) return null;

        const areaScores = {
            family: 0,
            health: 0,
            personalGrowth: 0,
            relationships: 0,
            career: 0,
            socialLife: 0,
            spirituality: 0,
            financial: 0
        };

        // Calculate average score for each life area
        lifeAreaQuestions.forEach((q, index) => {
            const answer = quizAnswers[index];
            if (answer !== undefined && answer !== null) {
                // Convert answer index to score (Strongly Agree=0->3, Agree=1->2, Disagree=2->1, Strongly Disagree=3->0)
                const score = ((3 - answer) / 3) * 100; // Convert to 0-100
                areaScores[q.area] += score;
            }
        });

        // Average the scores (3 questions per area)
        Object.keys(areaScores).forEach(area => {
            areaScores[area] = Math.round(areaScores[area] / 3);
        });

        return areaScores;
    };

    const scores = quizScores || calculateDefaultScores();

    const handleAnswer = (answerIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [currentQuestion]: answerIndex
        }));
    };

    const handleNext = async () => {
        if (currentQuestion < lifeAreaQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz complete - calculate scores and save
            const newScores = calculateQuizScores();
            setQuizScores(newScores);

            // Save to database
            if (userId) {
                setSaving(true);
                try {
                    const response = await fetch('/api/reflection-radar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId,
                            scores: newScores,
                            answers: quizAnswers,
                            completedAt: new Date().toISOString()
                        })
                    });

                    if (!response.ok) {
                        console.error('Failed to save reflection radar');
                    }
                } catch (error) {
                    console.error('Error saving reflection radar:', error);
                } finally {
                    setSaving(false);
                }
            }

            setShowQuiz(false);
            setCurrentQuestion(0);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const startQuiz = () => {
        setShowQuiz(true);
        setCurrentQuestion(0);
        setQuizAnswers({});
    };

    // Load saved reflection radar data on mount
    useEffect(() => {
        const loadSavedData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/reflection-radar?userId=${userId}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setQuizScores(data.data.scores);
                    setQuizAnswers(data.data.answers || {});
                }
            } catch (error) {
                console.error('Error loading reflection radar:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSavedData();
    }, [userId]);

    // Draw radar chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background circles
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // Draw axes - 8 life domains
        const labels = ['Family', 'Health', 'Personal Growth', 'Relationships', 'Career', 'Social Life', 'Spirituality', 'Financial'];
        const values = [
            scores.family,
            scores.health,
            scores.personalGrowth,
            scores.relationships,
            scores.career,
            scores.socialLife,
            scores.spirituality,
            scores.financial
        ];

        const angleStep = (2 * Math.PI) / labels.length;

        // Draw axis lines
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 1;
        labels.forEach((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        // Draw data polygon
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;

        ctx.beginPath();
        values.forEach((value, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (value / 100) * radius;
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#f43f5e';
        values.forEach((value, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (value / 100) * radius;
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        labels.forEach((label, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelDistance = radius + 25;
            const x = centerX + labelDistance * Math.cos(angle);
            const y = centerY + labelDistance * Math.sin(angle);

            ctx.fillText(label, x, y);
        });

    }, [scores]);

    return (
        <div className="">
            {/* <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBullseye} className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Reflection Radar</h2>
                    <p className="text-sm text-gray-600">Your life balance across 8 key domains</p>
                </div>
            </div> */}

            <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Radar Chart */}
                <div className="flex-shrink-0">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="max-w-full"
                    />
                </div>

                {/* Scores List */}
                <div className="flex-1 space-y-3 w-full">
                    {[
                        { label: 'Family', value: scores.family, desc: 'Emotional support and communication', color: 'from-blue-400 to-blue-600', icon: '👨‍👩‍👧‍👦' },
                        { label: 'Health', value: scores.health, desc: 'Physical energy and wellness', color: 'from-green-400 to-green-600', icon: '💪' },
                        { label: 'Personal Growth', value: scores.personalGrowth, desc: 'Learning and self-improvement', color: 'from-purple-400 to-purple-600', icon: '🌱' },
                        { label: 'Relationships', value: scores.relationships, desc: 'Love and emotional connection', color: 'from-pink-400 to-pink-600', icon: '❤️' },
                        { label: 'Career', value: scores.career, desc: 'Purpose and work-life balance', color: 'from-indigo-400 to-indigo-600', icon: '💼' },
                        { label: 'Social Life', value: scores.socialLife, desc: 'Belonging and friendships', color: 'from-yellow-400 to-yellow-600', icon: '🤝' },
                        { label: 'Spirituality', value: scores.spirituality, desc: 'Inner peace and mindfulness', color: 'from-teal-400 to-teal-600', icon: '🧘' },
                        { label: 'Financial', value: scores.financial, desc: 'Money management and stability', color: 'from-emerald-400 to-emerald-600', icon: '💰' }
                    ].map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <span>{item.icon}</span>
                                    {item.label}
                                </span>
                                <span className="text-sm font-bold text-rose-600">{item.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${item.value}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">💡 Insight:</span> {
                        !quizScores ? "Take the assessment to get personalized insights about your life balance." :
                            scores.health >= 70 && scores.relationships >= 70 ? "Great balance in health and relationships! Keep nurturing these areas." :
                                scores.career < 40 ? "Your career satisfaction could use attention. Consider what changes might bring more fulfillment." :
                                    scores.financial < 40 ? "Financial stress can impact wellbeing. Small steps toward financial goals can help." :
                                        scores.spirituality < 40 ? "Inner peace matters. Try adding mindfulness or reflection to your routine." :
                                            "You're doing well! Focus on areas below 50% for the most impact."
                    }
                </p>
            </div>

            {/* Check Now Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={startQuiz}
                    disabled={loading || saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faBullseye} className="h-5 w-5" />
                            {quizScores ? 'Retake Assessment' : 'Check Now'}
                        </>
                    )}
                </button>
                {quizScores && !loading && (
                    <p className="text-xs text-gray-500 mt-2">
                        Based on your assessment • Last updated: {new Date().toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Quiz Modal */}
            {showQuiz && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">Life Balance Assessment</h3>
                                    <button
                                        onClick={() => setShowQuiz(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>Question {currentQuestion + 1} of {lifeAreaQuestions.length}</span>
                                    <span>{Math.round(((currentQuestion + 1) / lifeAreaQuestions.length) * 100)}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentQuestion + 1) / lifeAreaQuestions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                    {lifeAreaQuestions[currentQuestion].text}
                                </h4>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-gray-500">
                                        💡 Select one option
                                    </p>
                                    {quizAnswers[currentQuestion] !== undefined && (
                                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                                            1 selected
                                        </span>
                                    )}
                                </div>

                                {/* Options as Tags/Chips */}
                                <div className="flex flex-wrap gap-3">
                                    {lifeAreaQuestions[currentQuestion].options.map((option, index) => {
                                        const isSelected = quizAnswers[currentQuestion] === index;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswer(index)}
                                                className={`px-6 py-3 rounded-full border-2 font-medium transition-all transform hover:scale-105 ${isSelected
                                                    ? 'border-rose-500 bg-rose-500 text-white shadow-lg'
                                                    : 'border-gray-300 bg-white text-gray-700 hover:border-rose-400 hover:bg-rose-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isSelected && (
                                                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                                                    )}
                                                    <span>{option}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${currentQuestion === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                                    Previous
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={quizAnswers[currentQuestion] === undefined}
                                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${quizAnswers[currentQuestion] !== undefined
                                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:shadow-lg'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {currentQuestion === lifeAreaQuestions.length - 1 ? 'Complete' : 'Next'}
                                    <FontAwesomeIcon icon={currentQuestion === lifeAreaQuestions.length - 1 ? faCheck : faArrowRight} className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
