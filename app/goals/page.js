"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const GOAL_CATEGORIES = [
    { id: "mental", name: "Mental Health", icon: faBrain, color: "purple" },
    { id: "emotional", name: "Emotional Well-being", icon: faHeart, color: "rose" },
    { id: "mindfulness", name: "Mindfulness", icon: faStar, color: "yellow" },
    { id: "habits", name: "Healthy Habits", icon: faFire, color: "orange" },
    { id: "personal", name: "Personal Growth", icon: faBullseye, color: "blue" },
];

export default function GoalsPage() {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: "",
        category: "mental",
        targetDays: 30,
        description: "",
        why: "",
        howToAchieve: "",
    });

    // Load goals from localStorage
    useEffect(() => {
        if (user?.uid) {
            const savedGoals = localStorage.getItem(`goals_${user.uid}`);
            if (savedGoals) {
                setGoals(JSON.parse(savedGoals));
            }
        }
    }, [user]);

    // Save goals to localStorage
    const saveGoals = (updatedGoals) => {
        if (user?.uid) {
            localStorage.setItem(`goals_${user.uid}`, JSON.stringify(updatedGoals));
            setGoals(updatedGoals);
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
        const updatedGoals = goals.map((goal) =>
            goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        );
        saveGoals(updatedGoals);
    };

    const deleteGoal = (goalId) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            saveGoals(goals.filter((goal) => goal.id !== goalId));
        }
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
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 pb-20">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Goals</span>
                        </div>
                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-6">
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

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-rose-100 bg-white/90 backdrop-blur">
                    <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600">
                        <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                        <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                        <MobileNavLink href="/blogs" icon={faNewspaper} label="Blogs" />
                        <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
                        <MobileNavLink href="/goals" icon={faBullseye} label="Goals" active />
                    </div>
                </nav>

                {/* Add Goal Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-6 shadow-xl">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">Set New Goal</h2>

                            <div className="space-y-4">
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={newGoal.category}
                                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                    >
                                        {GOAL_CATEGORIES.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Why is this goal important? *
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

                            <div className="mt-6 flex gap-3">
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

function GoalCard({ goal, onCheckIn, onToggleComplete, onDelete, getCategoryColor }) {
    const color = getCategoryColor(goal.category);
    const category = GOAL_CATEGORIES.find((c) => c.id === goal.category);
    const canCheckInToday = !goal.checkIns?.some(
        (date) => new Date(date).toDateString() === new Date().toDateString()
    );

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
