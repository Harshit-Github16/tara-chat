"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { api } from "../lib/api";
import { getQuizForLifeArea, calculateQuizScore } from "../lib/quizData";

export default function LifeAreaQuiz({ lifeArea, onComplete, onClose }) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadQuiz();
    }, [lifeArea]);

    const loadQuiz = async () => {
        try {
            setLoading(true);

            // Check if it's a default life area
            const defaultQuiz = getQuizForLifeArea(lifeArea);

            if (defaultQuiz) {
                setQuiz(defaultQuiz);
            } else {
                // Generate quiz using AI for custom life area
                const response = await api.post('/api/quiz/generate', { lifeArea });

                if (response.ok) {
                    const data = await response.json();
                    setQuiz(data.quiz);
                } else {
                    throw new Error('Failed to generate quiz');
                }
            }
        } catch (error) {
            console.error('Error loading quiz:', error);
            alert('Failed to load quiz. Please try again.');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (score) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);

        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz completed
            submitQuiz(newAnswers);
        }
    };

    const submitQuiz = async (finalAnswers) => {
        try {
            setSubmitting(true);
            const score = calculateQuizScore(finalAnswers);

            const response = await api.post('/api/quiz/results', {
                lifeArea,
                answers: finalAnswers,
                score
            });

            if (response.ok) {
                onComplete(lifeArea, score);
            } else {
                throw new Error('Failed to save quiz results');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to save quiz results. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin mb-4" />
                        <p className="text-gray-600">Loading quiz...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-rose-500 animate-spin mb-4" />
                        <p className="text-gray-600">Saving your results...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || quiz.length === 0) {
        return null;
    }

    const question = quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.length) * 100;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{lifeArea}</h2>
                        <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.length}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        {question.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option.score)}
                                className="w-full text-left px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                                        {option.text}
                                    </span>
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-rose-500 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Back Button (if not first question) */}
                {currentQuestion > 0 && (
                    <button
                        onClick={() => {
                            setCurrentQuestion(currentQuestion - 1);
                            setAnswers(answers.slice(0, -1));
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                        ← Back
                    </button>
                )}
            </div>
        </div>
    );
}
