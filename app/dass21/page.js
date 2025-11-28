"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

// DASS-21 Questions
const DASS21_QUESTIONS = [
    // Depression (1, 5, 10, 13, 16, 17, 21)
    { id: 1, text: "I found it hard to wind down", category: "stress" },
    { id: 2, text: "I was aware of dryness of my mouth", category: "anxiety" },
    { id: 3, text: "I couldn't seem to experience any positive feeling at all", category: "depression" },
    { id: 4, text: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness)", category: "anxiety" },
    { id: 5, text: "I found it difficult to work up the initiative to do things", category: "depression" },
    { id: 6, text: "I tended to over-react to situations", category: "stress" },
    { id: 7, text: "I experienced trembling (e.g., in the hands)", category: "anxiety" },
    { id: 8, text: "I felt that I was using a lot of nervous energy", category: "stress" },
    { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself", category: "anxiety" },
    { id: 10, text: "I felt that I had nothing to look forward to", category: "depression" },
    { id: 11, text: "I found myself getting agitated", category: "stress" },
    { id: 12, text: "I found it difficult to relax", category: "stress" },
    { id: 13, text: "I felt down-hearted and blue", category: "depression" },
    { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing", category: "stress" },
    { id: 15, text: "I felt I was close to panic", category: "anxiety" },
    { id: 16, text: "I was unable to become enthusiastic about anything", category: "depression" },
    { id: 17, text: "I felt I wasn't worth much as a person", category: "depression" },
    { id: 18, text: "I felt that I was rather touchy", category: "stress" },
    { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion", category: "anxiety" },
    { id: 20, text: "I felt scared without any good reason", category: "anxiety" },
    { id: 21, text: "I felt that life was meaningless", category: "depression" }
];

const RESPONSE_OPTIONS = [
    { value: 0, label: "Did not apply to me at all" },
    { value: 1, label: "Applied to me to some degree" },
    { value: 2, label: "Applied to me to a considerable degree" },
    { value: 3, label: "Applied to me very much" }
];

export default function DASS21Page() {
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
        if (currentQuestion < DASS21_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScores = () => {
        let depression = 0;
        let anxiety = 0;
        let stress = 0;

        DASS21_QUESTIONS.forEach((question, index) => {
            const answer = answers[index] || 0;
            if (question.category === "depression") depression += answer;
            if (question.category === "anxiety") anxiety += answer;
            if (question.category === "stress") stress += answer;
        });

        // Multiply by 2 for DASS-21 (to match DASS-42 scale)
        return {
            depression: depression * 2,
            anxiety: anxiety * 2,
            stress: stress * 2
        };
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

    const handleSubmit = async () => {
        if (Object.keys(answers).length < DASS21_QUESTIONS.length) {
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

            const response = await fetch("/api/dass21", {
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

    const progress = ((Object.keys(answers).length / DASS21_QUESTIONS.length) * 100).toFixed(0);
    const currentQ = DASS21_QUESTIONS[currentQuestion];
    const isLastQuestion = currentQuestion === DASS21_QUESTIONS.length - 1;
    const isAnswered = answers[currentQuestion] !== undefined;

    if (showResults && results) {
        const depressionSeverity = getSeverityLevel(results.scores.depression, "depression");
        const anxietySeverity = getSeverityLevel(results.scores.anxiety, "anxiety");
        const stressSeverity = getSeverityLevel(results.scores.stress, "stress");

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
                        <button
                            onClick={() => router.push("/insights")}
                            className="flex items-center gap-2 text-rose-600 hover:text-rose-700"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                            <span className="font-medium">Back to Insights</span>
                        </button>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl px-4 py-8">
                    <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-lg">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
                            <p className="text-gray-600">Here are your DASS-21 results</p>
                        </div>

                        <div className="space-y-6">
                            {/* Depression Score */}
                            <div className={`p-6 rounded-2xl ${depressionSeverity.bg} border border-gray-200`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">Depression</h3>
                                    <span className={`text-2xl font-bold ${depressionSeverity.color}`}>
                                        {results.scores.depression}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${depressionSeverity.color.replace('text-', 'bg-')}`}
                                            style={{ width: `${Math.min((results.scores.depression / 42) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-sm font-semibold ${depressionSeverity.color}`}>
                                        {depressionSeverity.level}
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

                        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 What do these scores mean?</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                The DASS-21 measures three related negative emotional states: Depression, Anxiety, and Stress.
                                Your results are now saved in your Insights page where you can track changes over time.
                                Remember, this is a screening tool and not a clinical diagnosis. If you're concerned about your
                                mental health, please consult with a healthcare professional.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-4">
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
                </div>

                <BottomNav activePage="dass21" />
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
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-rose-600 hover:text-rose-700"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-rose-600" />
                        <span className="text-lg font-semibold text-rose-600">DASS-21</span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Question {currentQuestion + 1} of {DASS21_QUESTIONS.length}
                        </span>
                        <span className="text-sm font-medium text-rose-600">{progress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-3xl border border-rose-100 p-8 shadow-lg mb-6">
                    <div className="mb-8">
                        <div className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {currentQ.text}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Over the past week, to what extent did this apply to you?
                        </p>
                    </div>

                    {/* Response Options */}
                    <div className="space-y-3">
                        {RESPONSE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(option.value)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${answers[currentQuestion] === option.value
                                    ? "border-rose-500 bg-rose-50"
                                    : "border-gray-200 hover:border-rose-300 hover:bg-rose-50/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === option.value
                                            ? "border-rose-500 bg-rose-500"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        {answers[currentQuestion] === option.value && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-6 py-3 rounded-full font-semibold border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isAnswered || isSubmitting}
                            className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                    Submit Assessment
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </button>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">ℹ️ About DASS-21</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        The DASS-21 is a scientifically validated assessment that measures Depression, Anxiety, and Stress.
                        It takes about 5 minutes to complete. Your responses are confidential and will help you track your
                        mental wellness over time.
                    </p>
                </div>
            </div>

            <BottomNav activePage="dass21" />
        </div>
    );
}
