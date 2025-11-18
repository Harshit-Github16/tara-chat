"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNav from "../components/BottomNav";
import {
    faPlus,
    faCheck,
    faTrash,
    faChartLine,
    faBookOpen,
    faComments,
    faUser,
    faBullseye,
    faNewspaper,
    faFire,
    faHeart,
    faBrain,
    faStar,
} from "@fortawesome/free-solid-svg-icons";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import confetti from "canvas-confetti";

const GOAL_CATEGORIES = [
    { id: "mental", name: "Mental Health", icon: faBrain, emoji: "🧠", color: "purple" },
    { id: "emotional", name: "Emotional Well-being", icon: faHeart, emoji: "💖", color: "rose" },
    { id: "mindfulness", name: "Mindfulness", icon: faStar, emoji: "⭐", color: "yellow" },
    { id: "habits", name: "Healthy Habits", icon: faFire, emoji: "🔥", color: "orange" },
    { id: "personal", name: "Personal Growth", icon: faBullseye, emoji: "🎯", color: "blue" },
];

export default function GoalsPage() {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGoalForSuggestions, setSelectedGoalForSuggestions] = useState(null);
    const [aiSuggestions, setAiSuggestions] = useState({});
    const [loadingSuggestions, setLoadingSuggestions] = useState({});
    const [newGoal, setNewGoal] = useState({
        title: "",
        category: "mental",
        targetDays: 30,
        description: "",
        why: "",
        howToAchieve: "",
    });

    // Load goals from database
    useEffect(() => {
        const fetchGoals = async () => {
            if (user?.uid) {
                try {
                    const userId = user.firebaseUid || user.uid;
                    const response = await fetch(`/api/goals?userId=${userId}`);
                    const data = await response.json();

                    if (data.success && data.goals) {
                        setGoals(data.goals);
                    }
                } catch (error) {
                    console.error('Failed to fetch goals:', error);
                }
            }
        };

        fetchGoals();
    }, [user]);

    // Save goals to database
    const saveGoals = async (updatedGoals) => {
        if (user?.uid) {
            try {
                const userId = user.firebaseUid || user.uid;
                const response = await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        goals: updatedGoals
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setGoals(updatedGoals);
                }
            } catch (error) {
                console.error('Failed to save goals:', error);
            }
        }
    };

    const addGoal = async () => {
        if (!newGoal.title.trim() || !newGoal.why.trim() || !newGoal.howToAchieve.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const userId = user?.firebaseUid || user?.uid;
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    ...newGoal
                })
            });

            const data = await response.json();

            if (data.success) {
                setGoals([...goals, data.goal]);
                setNewGoal({ title: "", category: "mental", targetDays: 30, description: "", why: "", howToAchieve: "" });
                setShowModal(false);
            } else {
                alert('Failed to create goal');
            }
        } catch (error) {
            console.error('Failed to create goal:', error);
            alert('Failed to create goal');
        }
    };

    const toggleGoalComplete = (goalId) => {
        const updatedGoals = goals.map((goal) => {
            if (goal.id === goalId) {
                const newCompletedState = !goal.completed;

                // Trigger confetti when goal is completed
                if (newCompletedState) {
                    const defaults = {
                        spread: 360,
                        ticks: 50,
                        gravity: 0,
                        decay: 0.94,
                        startVelocity: 30,
                        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
                    };

                    const shoot = () => {
                        confetti({
                            ...defaults,
                            particleCount: 40,
                            scalar: 1.2,
                            shapes: ["star"],
                        });
                        confetti({
                            ...defaults,
                            particleCount: 10,
                            scalar: 0.75,
                            shapes: ["circle"],
                        });
                    };

                    setTimeout(shoot, 0);
                    setTimeout(shoot, 100);
                    setTimeout(shoot, 200);
                }

                return { ...goal, completed: newCompletedState };
            }
            return goal;
        });
        saveGoals(updatedGoals);
    };

    const deleteGoal = (goalId) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            saveGoals(goals.filter((goal) => goal.id !== goalId));
        }
    };

    // Generate AI suggestions for a goal
    const generateAISuggestions = async (goal) => {
        setLoadingSuggestions(prev => ({ ...prev, [goal.id]: true }));

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.firebaseUid || user.uid,
                    chatUserId: 'tara-ai',
                    message: `I have a goal: "${goal.title}"

Category: ${goal.category}
Why: ${goal.why}
How: ${goal.howToAchieve}
Target: ${goal.targetDays} days

Give me exactly 5 specific, actionable suggestions to achieve this goal. Format your response EXACTLY like this:

1. [First suggestion - be specific and practical]
2. [Second suggestion - be specific and practical]
3. [Third suggestion - be specific and practical]
4. [Fourth suggestion - be specific and practical]
5. [Fifth suggestion - be specific and practical]

Make each suggestion short (1-2 sentences), practical, and easy to follow.`,
                    userDetails: {
                        name: user.name,
                        gender: user.gender,
                        ageRange: user.ageRange,
                        profession: user.profession,
                        interests: user.interests,
                        personalityTraits: user.personalityTraits
                    },
                    isGoalSuggestion: true, // Flag to indicate this needs longer response
                    skipChatHistory: true // Don't save this in chat history
                })
            });

            const data = await response.json();

            if (data.success) {
                // Parse AI response into suggestions array
                const suggestionsText = data.aiMessage.content;
                console.log('AI Response:', suggestionsText); // Debug log
                const suggestions = parseSuggestions(suggestionsText);
                console.log('Parsed suggestions:', suggestions); // Debug log

                if (suggestions.length === 0) {
                    alert('Could not parse suggestions. Please try again.');
                    return;
                }

                setAiSuggestions(prev => ({
                    ...prev,
                    [goal.id]: suggestions
                }));
            }
        } catch (error) {
            console.error('Failed to generate suggestions:', error);
            alert('Failed to generate suggestions. Please try again.');
        } finally {
            setLoadingSuggestions(prev => ({ ...prev, [goal.id]: false }));
        }
    };

    // Parse AI response into suggestions array
    const parseSuggestions = (text) => {
        const suggestions = [];

        // Try multiple parsing strategies

        // Strategy 1: Split by numbered points (1., 2., 3. or 1) 2) 3))
        const numberedPattern = /(?:^|\n)\s*(\d+)[\.\)]\s*([^\n]+)/g;
        let match;
        while ((match = numberedPattern.exec(text)) !== null) {
            const suggestion = match[2].trim();
            if (suggestion.length > 10) {
                suggestions.push(suggestion);
            }
        }

        // Strategy 2: If no numbered points, try bullet points
        if (suggestions.length === 0) {
            const bulletPattern = /(?:^|\n)\s*[-•*]\s*([^\n]+)/g;
            while ((match = bulletPattern.exec(text)) !== null) {
                const suggestion = match[1].trim();
                if (suggestion.length > 10) {
                    suggestions.push(suggestion);
                }
            }
        }

        // Strategy 3: If still no suggestions, split by double newlines or periods
        if (suggestions.length === 0) {
            const parts = text.split(/\n\n+|\. (?=[A-Z])/);
            parts.forEach(part => {
                const cleaned = part.trim().replace(/^\d+[\.\)]\s*/, '').replace(/^[-•*]\s*/, '');
                if (cleaned.length > 20 && cleaned.length < 300) {
                    suggestions.push(cleaned);
                }
            });
        }

        // Return 4-5 suggestions
        return suggestions.slice(0, 5);
    };

    const checkInGoal = (goalId) => {
        const updatedGoals = goals.map((goal) => {
            if (goal.id === goalId) {
                const checkIns = [...(goal.checkIns || []), new Date().toISOString()];
                const progress = Math.min(100, (checkIns.length / goal.targetDays) * 100);
                return { ...goal, checkIns, progress };
            }
            return goal;
        });
        saveGoals(updatedGoals);
    };

    const getCategoryColor = (category) => {
        const cat = GOAL_CATEGORIES.find((c) => c.id === category);
        return cat?.color || "rose";
    };

    const activeGoals = goals.filter((g) => !g.completed);
    const completedGoals = goals.filter((g) => g.completed);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-50">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara</span>
                        </Link>
                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-20">
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-rose-100 bg-white p-4 text-center">
                            <div className="text-2xl font-bold text-rose-600">{activeGoals.length}</div>
                            <div className="text-xs text-gray-600">Active Goals</div>
                        </div>
                        <div className="rounded-2xl border border-green-100 bg-white p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                            <div className="text-xs text-gray-600">Completed</div>
                        </div>
                        <div className="rounded-2xl border border-pink-100 bg-white p-4 text-center">
                            <div className="text-2xl font-bold text-pink-600">
                                {Math.round(
                                    activeGoals.reduce((acc, g) => acc + g.progress, 0) / (activeGoals.length || 1)
                                )}
                                %
                            </div>
                            <div className="text-xs text-gray-600">Avg Progress</div>
                        </div>
                    </div>

                    {/* Add Goal Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="mb-6 w-full rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 p-4 text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Set New Goal
                    </button>

                    {/* Active Goals */}
                    {activeGoals.length > 0 && (
                        <div className="mb-6">
                            <h2 className="mb-3 text-lg font-semibold text-gray-800">Active Goals</h2>
                            <div className="space-y-3">
                                {activeGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onCheckIn={checkInGoal}
                                        onToggleComplete={toggleGoalComplete}
                                        onDelete={deleteGoal}
                                        getCategoryColor={getCategoryColor}
                                        onGenerateSuggestions={generateAISuggestions}
                                        suggestions={aiSuggestions[goal.id]}
                                        loadingSuggestions={loadingSuggestions[goal.id]}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Goals */}
                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold text-gray-800">Completed Goals 🎉</h2>
                            <div className="space-y-3">
                                {completedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onCheckIn={checkInGoal}
                                        onToggleComplete={toggleGoalComplete}
                                        onDelete={deleteGoal}
                                        getCategoryColor={getCategoryColor}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {goals.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FontAwesomeIcon icon={faBullseye} className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No goals yet</h3>
                            <p className="text-gray-500 mb-4">Start your wellness journey by setting your first goal</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-full bg-rose-200 px-6 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300"
                            >
                                Set Your First Goal
                            </button>
                        </div>
                    )}
                </main>

                <BottomNav activePage="goals" />

                {/* Add Goal Modal - Simple & Responsive */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between flex-shrink-0">
                                <h2 className="text-xl font-bold text-gray-900">Set New Goal</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="space-y-4">
                                    {/* Goal Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                                        <input
                                            type="text"
                                            value={newGoal.title}
                                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                            placeholder="e.g., Meditate daily"
                                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={newGoal.category}
                                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        >
                                            {GOAL_CATEGORIES.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.emoji} {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Target Days */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target Days: {newGoal.targetDays}
                                        </label>
                                        <input
                                            type="range"
                                            min="7"
                                            max="90"
                                            value={newGoal.targetDays}
                                            onChange={(e) => setNewGoal({ ...newGoal, targetDays: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>7 days</span>
                                            <span>90 days</span>
                                        </div>
                                    </div>

                                    {/* Why Important */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Why is this important? *
                                        </label>
                                        <textarea
                                            value={newGoal.why}
                                            onChange={(e) => setNewGoal({ ...newGoal, why: e.target.value })}
                                            placeholder="e.g., To reduce stress and improve my mental health"
                                            rows="2"
                                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                            required
                                        />
                                    </div>

                                    {/* How to Achieve */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            How will you achieve this? *
                                        </label>
                                        <textarea
                                            value={newGoal.howToAchieve}
                                            onChange={(e) => setNewGoal({ ...newGoal, howToAchieve: e.target.value })}
                                            placeholder="e.g., Meditate for 10 minutes every morning before work"
                                            rows="2"
                                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                            required
                                        />
                                    </div>

                                    {/* Additional Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            value={newGoal.description}
                                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                            placeholder="Any other details..."
                                            rows="2"
                                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-rose-100 flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addGoal}
                                    className="flex-1 rounded-full bg-rose-200 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-300"
                                >
                                    Create Goal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

function GoalCard({ goal, onCheckIn, onToggleComplete, onDelete, getCategoryColor, onGenerateSuggestions, suggestions, loadingSuggestions }) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const color = getCategoryColor(goal.category);
    const category = GOAL_CATEGORIES.find((c) => c.id === goal.category);
    const canCheckInToday = !goal.checkIns?.some(
        (date) => new Date(date).toDateString() === new Date().toDateString()
    );

    const handleGetSuggestions = () => {
        if (!suggestions) {
            onGenerateSuggestions(goal);
        }
        setShowSuggestions(!showSuggestions);
    };

    return (
        <div
            className={`rounded-2xl border p-4 ${goal.completed
                ? "border-green-200 bg-green-50"
                : `border-${color}-200 bg-${color}-50`
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon
                            icon={category?.icon || faBullseye}
                            className={`h-4 w-4 text-${color}-600`}
                        />
                        <h3 className={`font-semibold text-gray-900 ${goal.completed ? "line-through" : ""}`}>
                            {goal.title}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-600">{category?.name}</p>
                    {goal.description && (
                        <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                    )}
                </div>
                <button
                    onClick={() => onDelete(goal.id)}
                    className="text-gray-400 hover:text-red-500"
                >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </button>
            </div>

            {/* Why & How */}
            {(goal.why || goal.howToAchieve) && (
                <div className="mb-3 space-y-2">
                    {goal.why && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-700">Why: </span>
                            <span className="text-gray-600">{goal.why}</span>
                        </div>
                    )}
                    {goal.howToAchieve && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-700">How: </span>
                            <span className="text-gray-600">{goal.howToAchieve}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            {!goal.completed && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{goal.checkIns?.length || 0} / {goal.targetDays} days</span>
                        <span>{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                        <div
                            className={`h-full rounded-full bg-${color}-500 transition-all`}
                            style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* AI Suggestions Button */}
            {!goal.completed && (
                <button
                    onClick={handleGetSuggestions}
                    disabled={loadingSuggestions}
                    className="w-full mb-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 hover:from-purple-200 hover:to-pink-200 transition-all flex items-center justify-center gap-2"
                >
                    {loadingSuggestions ? (
                        <>
                            <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                            Generating Suggestions...
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faBrain} className="h-4 w-4" />
                            {showSuggestions ? 'Hide' : 'Get'} Suggestions
                        </>
                    )}
                </button>
            )}

            {/* AI Suggestions Display */}
            {showSuggestions && suggestions && !loadingSuggestions && (
                <div className="mb-3 rounded-xl bg-white border border-purple-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon icon={faBrain} className="h-4 w-4 text-purple-600" />
                        <h4 className="font-semibold text-sm text-purple-900">AI Suggestions to Achieve Your Goal</h4>
                    </div>
                    <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                                    {index + 1}
                                </div>
                                <p className="text-xs text-gray-700 flex-1">{suggestion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {!goal.completed && (
                    <button
                        onClick={() => onCheckIn(goal.id)}
                        disabled={!canCheckInToday}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${canCheckInToday
                            ? `bg-${color}-200 text-${color}-700 hover:bg-${color}-300`
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {canCheckInToday ? "Check In Today" : "Already Checked In"}
                    </button>
                )}
                <button
                    onClick={() => onToggleComplete(goal.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${goal.completed
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-200 text-green-700 hover:bg-green-300"
                        }`}
                >
                    <FontAwesomeIcon icon={faCheck} className="mr-1" />
                    {goal.completed ? "Reopen" : "Complete"}
                </button>
            </div>
        </div>
    );
}

function MobileNavLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-rose-600" : "text-gray-600"
                }`}
        >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            {label}
        </Link>
    );
}
