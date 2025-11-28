"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLightbulb,
    faHeart,
    faBrain,
    faRunning,
    faUsers,
    faBook,
    faSpinner,
    faStar
} from "@fortawesome/free-solid-svg-icons";

export default function DASS21Suggestions({ scores }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (scores) {
            generateSuggestions();
        }
    }, [scores]);

    const generateSuggestions = async () => {
        setLoading(true);

        // Generate personalized suggestions based on scores
        const personalizedSuggestions = [];

        // Depression suggestions
        if (scores.depression > 9) {
            if (scores.depression > 20) {
                personalizedSuggestions.push({
                    icon: faHeart,
                    color: "text-rose-600",
                    bg: "bg-rose-50",
                    title: "Connect with Support",
                    description: "Your depression score indicates you may benefit from professional support. Consider talking to a mental health professional.",
                    actions: ["Talk to Tara AI", "Find a therapist", "Join support groups"]
                });
            }
            personalizedSuggestions.push({
                icon: faRunning,
                color: "text-green-600",
                bg: "bg-green-50",
                title: "Physical Activity",
                description: "Regular exercise can significantly improve mood. Start with 15-20 minutes of walking daily.",
                actions: ["Morning walk routine", "Yoga for beginners", "Dance therapy"]
            });
            personalizedSuggestions.push({
                icon: faBook,
                color: "text-blue-600",
                bg: "bg-blue-50",
                title: "Journaling Practice",
                description: "Writing down your thoughts can help process emotions and identify patterns.",
                actions: ["Start daily journal", "Gratitude practice", "Mood tracking"]
            });
        }

        // Anxiety suggestions
        if (scores.anxiety > 7) {
            if (scores.anxiety > 14) {
                personalizedSuggestions.push({
                    icon: faBrain,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    title: "Breathing Exercises",
                    description: "Practice deep breathing techniques to calm your nervous system and reduce anxiety symptoms.",
                    actions: ["4-7-8 breathing", "Box breathing", "Progressive relaxation"]
                });
            }
            personalizedSuggestions.push({
                icon: faUsers,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                title: "Social Connection",
                description: "Connecting with trusted friends or family can help reduce feelings of anxiety.",
                actions: ["Call a friend", "Join community", "Share your feelings"]
            });
        }

        // Stress suggestions
        if (scores.stress > 14) {
            if (scores.stress > 25) {
                personalizedSuggestions.push({
                    icon: faStar,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                    title: "Stress Management",
                    description: "Your stress levels are high. Prioritize self-care and consider reducing commitments.",
                    actions: ["Time management", "Set boundaries", "Delegate tasks"]
                });
            }
            personalizedSuggestions.push({
                icon: faHeart,
                color: "text-pink-600",
                bg: "bg-pink-50",
                title: "Mindfulness & Meditation",
                description: "Regular mindfulness practice can help reduce stress and improve emotional regulation.",
                actions: ["5-min meditation", "Mindful breathing", "Body scan"]
            });
        }

        // If all scores are normal
        if (scores.depression <= 9 && scores.anxiety <= 7 && scores.stress <= 14) {
            personalizedSuggestions.push({
                icon: faStar,
                color: "text-green-600",
                bg: "bg-green-50",
                title: "Maintain Your Wellness",
                description: "Great job! Your scores are in the normal range. Keep up your healthy habits.",
                actions: ["Continue journaling", "Stay active", "Connect with others"]
            });
            personalizedSuggestions.push({
                icon: faLightbulb,
                color: "text-blue-600",
                bg: "bg-blue-50",
                title: "Build Resilience",
                description: "Focus on building emotional resilience to handle future challenges.",
                actions: ["Learn new skills", "Set goals", "Practice gratitude"]
            });
        }

        // General wellness suggestions
        personalizedSuggestions.push({
            icon: faBook,
            color: "text-teal-600",
            bg: "bg-teal-50",
            title: "Educational Resources",
            description: "Learn more about mental health and wellness through our blog and resources.",
            actions: ["Read wellness blogs", "Watch videos", "Take courses"]
        });

        setSuggestions(personalizedSuggestions.slice(0, 4)); // Show top 4 suggestions
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin" />
                <p className="text-gray-500 mt-2">Generating personalized suggestions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
            </div>

            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className={`p-4 rounded-xl ${suggestion.bg} border border-gray-200 hover:shadow-md transition-all`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${suggestion.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                            <FontAwesomeIcon icon={suggestion.icon} className={`h-5 w-5 ${suggestion.color}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-semibold ${suggestion.color} mb-1`}>
                                {suggestion.title}
                            </h4>
                            <p className="text-sm text-gray-700 mb-3">
                                {suggestion.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestion.actions.map((action, actionIndex) => (
                                    <span
                                        key={actionIndex}
                                        className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-700 hover:border-gray-300 cursor-pointer transition-all"
                                    >
                                        {action}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Professional Help Notice */}
            {(scores.depression > 20 || scores.anxiety > 14 || scores.stress > 25) && (
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                            <h4 className="font-semibold text-red-800 mb-1">
                                Consider Professional Support
                            </h4>
                            <p className="text-sm text-red-700 leading-relaxed">
                                Your scores indicate you may be experiencing significant distress.
                                While Tara can provide support, we strongly recommend consulting with
                                a mental health professional for personalized care.
                            </p>
                            <div className="mt-3">
                                <button className="text-sm font-semibold text-red-700 hover:text-red-800 underline">
                                    Find mental health resources →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Positive Reinforcement */}
            {scores.depression <= 9 && scores.anxiety <= 7 && scores.stress <= 14 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">🎉</div>
                        <div>
                            <h4 className="font-semibold text-green-800 mb-1">
                                You're Doing Great!
                            </h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                                Your mental wellness scores are in a healthy range. Keep maintaining
                                your positive habits and continue using Tara for daily support.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat with Tara CTA */}
            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900">Talk to Tara</h4>
                            <p className="text-xs text-gray-600">Get personalized support 24/7</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/chatlist'}
                        className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                    >
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}
