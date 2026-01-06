"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClipboardList,
    faArrowLeft,
    faArrowRight,
    faCheckCircle,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";
import LoginModal from "../components/LoginModal";
import ProfileCompletionCircle from "../components/ProfileCompletionCircle";

// Stress Level Check Questions
const STRESS_CHECK_QUESTIONS = [
    { id: 1, text: "I found it hard to calm myself down", category: "stress" },
    { id: 2, text: "My mouth felt dry", category: "anxiety" },
    { id: 3, text: "I could not feel any positive or good feelings", category: "lowmood" },
    { id: 4, text: "I had trouble breathing (like fast or short breaths)", category: "anxiety" },
    { id: 5, text: "I had no motivation to start doing things", category: "lowmood" },
    { id: 6, text: "I reacted too strongly to small situations", category: "stress" },
    { id: 7, text: "I felt my hands or body shaking", category: "anxiety" },
    { id: 8, text: "I felt like I was using too much nervous energy", category: "stress" },
    { id: 9, text: "I was worried I might panic or embarrass myself", category: "anxiety" },
    { id: 10, text: "I felt like I had nothing to look forward to", category: "lowmood" },
    { id: 11, text: "I felt easily irritated or annoyed", category: "stress" },
    { id: 12, text: "I found it hard to relax", category: "stress" },
    { id: 13, text: "I felt sad or low", category: "lowmood" },
    { id: 14, text: "I got annoyed when something slowed me down", category: "stress" },
    { id: 15, text: "I felt like I was close to panicking", category: "anxiety" },
    { id: 16, text: "I couldn't feel excited about anything", category: "lowmood" },
    { id: 17, text: "I felt like I was not a valuable person", category: "lowmood" },
    { id: 18, text: "I felt touchy and got upset easily", category: "stress" },
    { id: 19, text: "I could feel my heart beating fast even without activity", category: "anxiety" },
    { id: 20, text: "I felt scared for no clear reason", category: "anxiety" },
    { id: 21, text: "I felt like life had no meaning", category: "lowmood" }
];


const RESPONSE_OPTIONS = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Sometimes" },
    { value: 2, label: "Often" },
    { value: 3, label: "Most of the time" }
];

export default function StressCheckPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            setShowLoginModal(true);
        }
    }, [user, authLoading]);

    const handleLoginSuccess = (isNewUser, userData) => {
        if (isNewUser || !userData.isOnboardingComplete) {
            router.push('/?showOnboarding=true');
        } else {
            setShowLoginModal(false);
        }
    };

    const handleAnswer = (value) => {
        setAnswers({ ...answers, [currentQuestion]: value });
    };

    const handleNext = () => {
        if (currentQuestion < STRESS_CHECK_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScores = () => {
        let lowmood = 0;
        let anxiety = 0;
        let stress = 0;

        STRESS_CHECK_QUESTIONS.forEach((question, index) => {
            const answer = answers[index] || 0;
            if (question.category === "lowmood") lowmood += answer;
            if (question.category === "anxiety") anxiety += answer;
            if (question.category === "stress") stress += answer;
        });

        // Multiply by 2 to normalize scores
        return {
            lowmood: lowmood * 2,
            anxiety: anxiety * 2,
            stress: stress * 2
        };
    };

    const getSeverityLevel = (score, category) => {
        const ranges = {
            lowmood: [
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

    const handleSubmit = async () => {
        if (Object.keys(answers).length < STRESS_CHECK_QUESTIONS.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            const scores = calculateScores();
            const assessmentData = {
                answers,
                scores,
                completedAt: new Date().toISOString()
            };

            const token = localStorage.getItem("authToken");
            if (!token) {
                alert("Please log in to save your assessment.");
                setIsSubmitting(false);
                return;
            }

            const response = await fetch("/api/stress-check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(assessmentData)
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.assessment);
                setShowResults(true);
            } else {
                alert("Failed to save assessment. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting assessment:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = ((Object.keys(answers).length / STRESS_CHECK_QUESTIONS.length) * 100).toFixed(0);
    const currentQ = STRESS_CHECK_QUESTIONS[currentQuestion];
    const isLastQuestion = currentQuestion === STRESS_CHECK_QUESTIONS.length - 1;
    const isAnswered = answers[currentQuestion] !== undefined;

    if (showResults && results) {
        const lowmoodSeverity = getSeverityLevel(results.scores.lowmood, "lowmood");
        const anxietySeverity = getSeverityLevel(results.scores.anxiety, "anxiety");
        const stressSeverity = getSeverityLevel(results.scores.stress, "stress");

        // Get personalized suggestions based on severity
        const getSuggestions = () => {
            const suggestions = [];

            // Low Mood suggestions
            if (results.scores.lowmood > 9) {
                suggestions.push({
                    icon: "💙",
                    title: "Mood Support",
                    level: lowmoodSeverity.level,
                    color: lowmoodSeverity.color,
                    bg: lowmoodSeverity.bg,
                    tips: [
                        "Practice daily gratitude journaling",
                        "Engage in physical activities you enjoy",
                        "Connect with supportive friends or family",
                        "Consider speaking with a mental health professional"
                    ]
                });
            }

            // Anxiety suggestions
            if (results.scores.anxiety > 7) {
                suggestions.push({
                    icon: "🌸",
                    title: "Anxiety Management",
                    level: anxietySeverity.level,
                    color: anxietySeverity.color,
                    bg: anxietySeverity.bg,
                    tips: [
                        "Practice deep breathing exercises (4-7-8 technique)",
                        "Try progressive muscle relaxation",
                        "Limit caffeine and alcohol intake",
                        "Establish a calming bedtime routine"
                    ]
                });
            }

            // Stress suggestions
            if (results.scores.stress > 14) {
                suggestions.push({
                    icon: "🧘",
                    title: "Stress Management",
                    level: stressSeverity.level,
                    color: stressSeverity.color,
                    bg: stressSeverity.bg,
                    tips: [
                        "Practice mindfulness meditation daily",
                        "Set healthy boundaries in work and relationships",
                        "Take regular breaks throughout the day",
                        "Engage in hobbies that bring you joy"
                    ]
                });
            }

            // If all scores are normal
            if (suggestions.length === 0) {
                suggestions.push({
                    icon: "✨",
                    title: "Maintain Your Wellness",
                    level: "Normal",
                    color: "text-green-600",
                    bg: "bg-green-50",
                    tips: [
                        "Continue your healthy habits",
                        "Stay connected with loved ones",
                        "Keep up with regular exercise",
                        "Practice self-care regularly"
                    ]
                });
            }

            return suggestions;
        };

        const suggestions = getSuggestions();

        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                    showCloseButton={false}
                />

                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                        </Link>
                        <Link href="/profile" className="relative">
                            <ProfileCompletionCircle />
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                        <p className="text-gray-600">Here are your stress check results and personalized recommendations</p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Results */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    📊 Your Scores
                                </h2>

                                <div className="space-y-6">
                                    {/* Low Mood Score */}
                                    <div className={`p-6 rounded-2xl ${lowmoodSeverity.bg} border border-gray-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">Low Mood</h3>
                                            <span className={`text-2xl font-bold ${lowmoodSeverity.color}`}>
                                                {results.scores.lowmood}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${lowmoodSeverity.color.replace('text-', 'bg-')}`}
                                                    style={{ width: `${Math.min((results.scores.lowmood / 42) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-sm font-semibold ${lowmoodSeverity.color}`}>
                                                {lowmoodSeverity.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Anxiety Score */}
                                    <div className={`p-6 rounded-2xl ${anxietySeverity.bg} border border-gray-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">Anxiety</h3>
                                            <span className={`text-2xl font-bold ${anxietySeverity.color}`}>
                                                {results.scores.anxiety}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${anxietySeverity.color.replace('text-', 'bg-')}`}
                                                    style={{ width: `${Math.min((results.scores.anxiety / 42) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-sm font-semibold ${anxietySeverity.color}`}>
                                                {anxietySeverity.level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stress Score */}
                                    <div className={`p-6 rounded-2xl ${stressSeverity.bg} border border-gray-200`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">Stress</h3>
                                            <span className={`text-2xl font-bold ${stressSeverity.color}`}>
                                                {results.scores.stress}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${stressSeverity.color.replace('text-', 'bg-')}`}
                                                    style={{ width: `${Math.min((results.scores.stress / 42) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-sm font-semibold ${stressSeverity.color}`}>
                                                {stressSeverity.level}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                        <strong>Note:</strong> This is a screening tool, not a clinical diagnosis.
                                        If you're concerned about your mental health, please consult a healthcare professional.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push("/insights")}
                                    className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                                >
                                    View in Insights
                                </button>
                                <button
                                    onClick={() => {
                                        setShowResults(false);
                                        setCurrentQuestion(0);
                                        setAnswers({});
                                        setResults(null);
                                    }}
                                    className="flex-1 bg-white text-rose-600 px-6 py-3 rounded-full font-semibold border-2 border-rose-200 hover:bg-rose-50 transition-all"
                                >
                                    Take Again
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Suggestions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    💡 Personalized Recommendations
                                </h2>

                                <div className="space-y-4">
                                    {suggestions.map((suggestion, index) => (
                                        <div key={index} className={`p-5 rounded-2xl ${suggestion.bg} border border-gray-200`}>
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl">{suggestion.icon}</span>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900">{suggestion.title}</h3>
                                                    <span className={`text-sm font-medium ${suggestion.color}`}>
                                                        {suggestion.level} Level
                                                    </span>
                                                </div>
                                            </div>
                                            <ul className="space-y-2">
                                                {suggestion.tips.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="text-rose-500 mt-1">•</span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Professional Help Section */}
                                {(results.scores.lowmood > 20 || results.scores.anxiety > 14 || results.scores.stress > 25) && (
                                    <div className="mt-6 p-5 bg-red-50 rounded-2xl border-2 border-red-200">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">⚠️</span>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    Consider Professional Support
                                                </h3>
                                                <p className="text-sm text-gray-700 mb-3">
                                                    Your scores indicate moderate to severe levels. We strongly recommend
                                                    speaking with a mental health professional who can provide personalized care.
                                                </p>
                                                <button
                                                    onClick={() => router.push("/contact")}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all"
                                                >
                                                    Get Help Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Talk to Tara */}
                                <div className="mt-6 p-5 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl border border-rose-200">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💬</span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Talk to Tara
                                            </h3>
                                            <p className="text-sm text-gray-700 mb-3">
                                                I'm here to listen and support you. Let's talk about how you're feeling.
                                            </p>
                                            <button
                                                onClick={() => router.push("/chatlist")}
                                                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                                            >
                                                Start Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <BottomNav activePage="stress-check" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
                showCloseButton={false}
            />

            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                    </Link>
                    <Link href="/profile" className="relative">
                        <ProfileCompletionCircle />
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-4">
                {/* Enhanced Progress Section */}
                <div className="mb-2 bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {currentQuestion + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Question Progress</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {currentQuestion + 1} of {STRESS_CHECK_QUESTIONS.length}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">Completion</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                                {progress}%
                            </p>
                        </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Question Card */}
                <div className="bg-gradient-to-br from-white to-rose-50/30 rounded-3xl border-2 border-rose-100 p-8 shadow-xl mb-6 transform transition-all duration-300 hover:shadow-2xl">
                    <div className="mb-8">
                        {/* Question Number Badge */}


                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {currentQ.text}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <span className="text-lg">💭</span>
                            <p>Over the past week, to what extent did this apply to you?</p>
                        </div>
                    </div>

                    {/* Enhanced Response Options */}
                    <div className="space-y-3">
                        {RESPONSE_OPTIONS.map((option, index) => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(option.value)}
                                className={`group w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${answers[currentQuestion] === option.value
                                    ? "border-rose-500 bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg scale-[1.02]"
                                    : "border-gray-200 hover:border-rose-300 hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-pink-50/50 hover:shadow-md"
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${answers[currentQuestion] === option.value
                                            ? "border-rose-500 bg-gradient-to-br from-rose-500 to-pink-500 shadow-md"
                                            : "border-gray-300 group-hover:border-rose-400"
                                            }`}
                                    >
                                        {answers[currentQuestion] === option.value && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                    <span className={`font-medium transition-colors ${answers[currentQuestion] === option.value
                                        ? "text-rose-700"
                                        : "text-gray-700 group-hover:text-gray-900"
                                        }`}>
                                        {option.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Enhanced Navigation Buttons */}
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-8 py-4 rounded-2xl font-semibold border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isAnswered || isSubmitting}
                            className="flex-1 bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                    Submit Assessment 🎯
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className="flex-1 bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Next Question
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </button>
                    )}
                </div>

                {/* Enhanced Info Box */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                            ℹ️
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">About Stress Level Check</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                This assessment helps you understand your current stress, anxiety, and mood levels.
                                It takes about 5 minutes to complete. Your responses are confidential and will help you track your
                                mental wellness over time. 🧠💙
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav activePage="stress-check" />
        </div >
    );
}
