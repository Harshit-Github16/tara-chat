"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function LifeAreaSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasQuizData, setHasQuizData] = useState(false);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);

            // Fetch quiz results
            const response = await api.get('/api/quiz/results');

            if (response.ok) {
                const data = await response.json();
                const quizResults = data.quizResults || {};
                const lifeAreas = data.lifeAreas || [];

                // Check if user has completed any quizzes
                if (Object.keys(quizResults).length > 0) {
                    setHasQuizData(true);

                    // Generate AI suggestions based on quiz results
                    await generateSuggestions(quizResults, lifeAreas);
                } else {
                    setHasQuizData(false);
                }
            } else {
                // Silently handle error - user might not be logged in
                console.log('Could not fetch quiz results - user may not be logged in');
                setHasQuizData(false);
            }
        } catch (error) {
            // Silently handle error - user might not be logged in
            console.log('Error fetching suggestions - user may not be logged in');
            setHasQuizData(false);
        } finally {
            setLoading(false);
        }
    };

    const generateSuggestions = async (quizResults, lifeAreas) => {
        try {
            // Find areas that need improvement (score < 70)
            const areasNeedingImprovement = [];

            Object.entries(quizResults).forEach(([area, data]) => {
                if (data.score < 70) {
                    areasNeedingImprovement.push({
                        area,
                        score: data.score
                    });
                }
            });

            // Sort by lowest score first
            areasNeedingImprovement.sort((a, b) => a.score - b.score);

            // Generate suggestions using AI
            const response = await api.post('/api/suggestions/generate', {
                areas: areasNeedingImprovement.slice(0, 3), // Top 3 areas needing improvement
                allResults: quizResults
            });

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions || []);
            } else {
                // Fallback to default suggestions if AI fails
                setSuggestions(generateDefaultSuggestions(areasNeedingImprovement));
            }
        } catch (error) {
            console.error('Error generating suggestions:', error);
            // Fallback to default suggestions
            setSuggestions(generateDefaultSuggestions(areasNeedingImprovement));
        }
    };

    const generateDefaultSuggestions = (areas) => {
        const defaultSuggestions = {
            'Career': [
                { icon: '🎯', title: 'Set Clear Goals', description: 'Define specific, measurable career objectives for the next 6 months' },
                { icon: '📚', title: 'Skill Development', description: 'Invest 30 minutes daily in learning new skills relevant to your field' },
                { icon: '🤝', title: 'Network Building', description: 'Connect with 2-3 professionals in your industry each week' }
            ],
            'Relationships': [
                { icon: '💬', title: 'Quality Time', description: 'Schedule regular one-on-one time with loved ones without distractions' },
                { icon: '❤️', title: 'Express Gratitude', description: 'Share appreciation with someone important to you daily' },
                { icon: '🎭', title: 'Active Listening', description: 'Practice being fully present in conversations' }
            ],
            'Health': [
                { icon: '🏃', title: 'Daily Movement', description: 'Aim for 30 minutes of physical activity each day' },
                { icon: '🥗', title: 'Nutrition Focus', description: 'Add more whole foods and reduce processed items' },
                { icon: '😴', title: 'Sleep Routine', description: 'Maintain consistent sleep schedule of 7-8 hours' }
            ],
            'Personal Growth': [
                { icon: '📖', title: 'Daily Reading', description: 'Read for 20 minutes daily to expand your knowledge' },
                { icon: '🧘', title: 'Mindfulness Practice', description: 'Start with 5-minute meditation sessions' },
                { icon: '✍️', title: 'Journaling', description: 'Reflect on your day and set intentions each morning' }
            ],
            'Finance': [
                { icon: '💰', title: 'Budget Planning', description: 'Track expenses and create a realistic monthly budget' },
                { icon: '📊', title: 'Emergency Fund', description: 'Save at least 10% of income for unexpected expenses' },
                { icon: '📈', title: 'Financial Education', description: 'Learn about investing and wealth building strategies' }
            ],
            'Social Life': [
                { icon: '🎉', title: 'Social Activities', description: 'Join a club or group aligned with your interests' },
                { icon: '☕', title: 'Regular Meetups', description: 'Schedule weekly coffee or lunch with friends' },
                { icon: '🎨', title: 'Shared Hobbies', description: 'Engage in activities that bring people together' }
            ]
        };

        const suggestions = [];
        areas.slice(0, 3).forEach(({ area }) => {
            const areaSuggestions = defaultSuggestions[area] || defaultSuggestions['Personal Growth'];
            suggestions.push(...areaSuggestions.slice(0, 2));
        });

        return suggestions.slice(0, 5);
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Generating personalized suggestions...</p>
            </div>
        );
    }

    if (!hasQuizData) {
        return (
            <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">📊</div>
                <div className="text-base font-semibold text-gray-700 mb-2">
                    Complete Life Area Assessments
                </div>
                <div className="text-sm text-gray-500">
                    Take the Support Reflection Radar quiz to get personalized improvement suggestions
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-8 px-4">
                <div className="text-4xl mb-3">🌟</div>
                <div className="text-base font-semibold text-gray-700 mb-2">
                    You're doing great!
                </div>
                <div className="text-sm text-gray-500">
                    All your life areas are well-balanced. Keep up the good work!
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-amber-500" />
                <h4 className="text-sm font-semibold text-gray-700">Personalized Suggestions</h4>
            </div>

            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 hover:shadow-md transition-all"
                >
                    <div className="text-2xl flex-shrink-0">{suggestion.icon}</div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 mb-1">
                            {suggestion.title}
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                            {suggestion.description}
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 text-center">
                    💡 These suggestions are based on your life area assessments. Update your quiz responses regularly for fresh insights!
                </p>
            </div>
        </div>
    );
}
