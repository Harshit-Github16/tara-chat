"use client";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faArrowRight, faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ReflectionRadar({ moodData, userId }) {
    const canvasRef = useRef(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScores, setQuizScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Questions for each emotion (3 questions each)
    const emotionQuestions = [
        // Joy questions
        { emotion: 'joy', text: 'How often do you feel happy or content in your daily life?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'joy', text: 'Do you find yourself smiling or laughing regularly?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'joy', text: 'How satisfied are you with your current life situation?', options: ['Not Satisfied', 'Somewhat', 'Satisfied', 'Very Satisfied'] },

        // Trust questions
        { emotion: 'trust', text: 'Do you feel safe and secure in your relationships?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'trust', text: 'How comfortable are you relying on others for support?', options: ['Not Comfortable', 'Somewhat', 'Comfortable', 'Very Comfortable'] },
        { emotion: 'trust', text: 'Do you feel accepted by the people around you?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },

        // Fear questions
        { emotion: 'fear', text: 'How often do you feel anxious or worried?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'fear', text: 'Do you experience fear about the future?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'fear', text: 'How often do you feel overwhelmed by uncertainty?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },

        // Surprise questions
        { emotion: 'surprise', text: 'How often do unexpected events catch you off guard?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'surprise', text: 'Do you feel excited by new experiences?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'surprise', text: 'How adaptable are you to sudden changes?', options: ['Not Adaptable', 'Somewhat', 'Adaptable', 'Very Adaptable'] },

        // Sadness questions
        { emotion: 'sadness', text: 'How often do you feel sad or down?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'sadness', text: 'Do you experience feelings of loss or grief?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'sadness', text: 'How often do you feel lonely or isolated?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },

        // Disgust questions
        { emotion: 'disgust', text: 'How often do you feel repulsed by certain situations?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'disgust', text: 'Do you experience strong aversion to things around you?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'disgust', text: 'How often do you feel the need to reject or avoid things?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },

        // Anger questions
        { emotion: 'anger', text: 'How often do you feel frustrated or irritated?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'anger', text: 'Do you experience anger towards people or situations?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'anger', text: 'How often do you feel the urge to express your anger?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },

        // Anticipation questions
        { emotion: 'anticipation', text: 'How often do you look forward to future events?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'anticipation', text: 'Do you feel excited about upcoming opportunities?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] },
        { emotion: 'anticipation', text: 'How often do you plan ahead with enthusiasm?', options: ['Rarely', 'Sometimes', 'Often', 'Very Often'] }
    ];

    // Calculate emotion scores from mood data (Plutchik's 8 basic emotions)
    const calculateEmotionScores = () => {
        if (!moodData || !moodData.moodByDate) {
            return {
                joy: 0,
                trust: 0,
                fear: 0,
                surprise: 0,
                sadness: 0,
                disgust: 0,
                anger: 0,
                anticipation: 0
            };
        }

        const moods = Object.values(moodData.moodByDate);
        const totalEntries = moods.length;

        if (totalEntries === 0) {
            return {
                joy: 0,
                trust: 0,
                fear: 0,
                surprise: 0,
                sadness: 0,
                disgust: 0,
                anger: 0,
                anticipation: 0
            };
        }

        // Map moods to Plutchik's 8 basic emotions
        const emotionMapping = {
            joy: ['happy', 'excited', 'grateful'],
            trust: ['calm', 'grateful'],
            fear: ['anxious', 'stressed'],
            surprise: ['excited', 'confused'],
            sadness: ['sad', 'tired', 'lonely'],
            disgust: ['angry', 'frustrated'],
            anger: ['angry', 'stressed'],
            anticipation: ['excited', 'anxious']
        };

        // Calculate percentage for each emotion
        const scores = {};
        Object.keys(emotionMapping).forEach(emotion => {
            const relatedMoods = emotionMapping[emotion];
            const count = moods.filter(m => relatedMoods.includes(m)).length;
            scores[emotion] = Math.round((count / totalEntries) * 100);
        });

        // Normalize scores to make them more visible (minimum 20% for any tracked emotion)
        Object.keys(scores).forEach(emotion => {
            if (scores[emotion] > 0 && scores[emotion] < 20) {
                scores[emotion] = 20;
            }
        });

        return scores;
    };

    // Calculate scores from quiz if available, otherwise from mood data
    const calculateQuizScores = () => {
        if (!quizAnswers || Object.keys(quizAnswers).length === 0) return null;

        const emotionScores = {
            joy: 0, trust: 0, fear: 0, surprise: 0,
            sadness: 0, disgust: 0, anger: 0, anticipation: 0
        };

        // Calculate average score for each emotion
        emotionQuestions.forEach((q, index) => {
            const answer = quizAnswers[index];
            if (answer !== undefined) {
                const score = (answer / 3) * 100; // Convert 0-3 to 0-100
                emotionScores[q.emotion] += score;
            }
        });

        // Average the scores (3 questions per emotion)
        Object.keys(emotionScores).forEach(emotion => {
            emotionScores[emotion] = Math.round(emotionScores[emotion] / 3);
        });

        return emotionScores;
    };

    const scores = quizScores || calculateEmotionScores();

    const handleAnswer = (answerIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [currentQuestion]: answerIndex
        }));
    };

    const handleNext = async () => {
        if (currentQuestion < emotionQuestions.length - 1) {
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

        // Draw axes - Plutchik's 8 basic emotions
        const labels = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];
        const values = [
            scores.joy,
            scores.trust,
            scores.fear,
            scores.surprise,
            scores.sadness,
            scores.disgust,
            scores.anger,
            scores.anticipation
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
                    <p className="text-sm text-gray-600">Your emotional intelligence dimensions</p>
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
                        { label: 'Joy', value: scores.joy, desc: 'Happiness and contentment', color: 'from-yellow-400 to-yellow-600' },
                        { label: 'Trust', value: scores.trust, desc: 'Acceptance and calm', color: 'from-green-400 to-green-600' },
                        { label: 'Fear', value: scores.fear, desc: 'Anxiety and worry', color: 'from-purple-400 to-purple-600' },
                        { label: 'Surprise', value: scores.surprise, desc: 'Unexpected emotions', color: 'from-blue-400 to-blue-600' },
                        { label: 'Sadness', value: scores.sadness, desc: 'Low mood and grief', color: 'from-indigo-400 to-indigo-600' },
                        { label: 'Disgust', value: scores.disgust, desc: 'Aversion and rejection', color: 'from-pink-400 to-pink-600' },
                        { label: 'Anger', value: scores.anger, desc: 'Frustration and rage', color: 'from-red-400 to-red-600' },
                        { label: 'Anticipation', value: scores.anticipation, desc: 'Expectation and interest', color: 'from-orange-400 to-orange-600' }
                    ].map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
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
                        scores.joy >= 50 ? "You're experiencing high levels of joy! Keep nurturing positive emotions." :
                            scores.sadness >= 50 ? "You're experiencing sadness. Remember, it's okay to feel this way. Consider talking to someone." :
                                scores.fear >= 50 ? "You're experiencing fear or anxiety. Try grounding techniques and reach out for support." :
                                    scores.anger >= 50 ? "You're experiencing anger. Take deep breaths and find healthy outlets." :
                                        "Your emotions are balanced. Keep tracking to understand your patterns better."
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
                                    <h3 className="text-2xl font-bold text-gray-900">Emotion Assessment</h3>
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
                                    <span>Question {currentQuestion + 1} of {emotionQuestions.length}</span>
                                    <span>{Math.round(((currentQuestion + 1) / emotionQuestions.length) * 100)}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentQuestion + 1) / emotionQuestions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <h4 className="text-xl font-semibold text-gray-900 mb-6">
                                    {emotionQuestions[currentQuestion].text}
                                </h4>

                                {/* Options */}
                                <div className="space-y-3">
                                    {emotionQuestions[currentQuestion].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all ${quizAnswers[currentQuestion] === index
                                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                                : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{option}</span>
                                                {quizAnswers[currentQuestion] === index && (
                                                    <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-rose-600" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
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
                                    {currentQuestion === emotionQuestions.length - 1 ? 'Complete' : 'Next'}
                                    <FontAwesomeIcon icon={currentQuestion === emotionQuestions.length - 1 ? faCheck : faArrowRight} className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
