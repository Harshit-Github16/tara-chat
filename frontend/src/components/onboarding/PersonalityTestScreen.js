'use client';

import { useState } from 'react';

const questions = [
    { id: 1, text: "I understand my emotions well.", category: "emotional_awareness" },
    { id: 2, text: "I stay calm under pressure.", category: "emotional_stability" },
    { id: 3, text: "I bounce back quickly from setbacks.", category: "resilience" },
    { id: 4, text: "I can sense others' feelings easily.", category: "empathy" },
    { id: 5, text: "I express my feelings clearly.", category: "communication" },
    { id: 6, text: "I tend to avoid conflict.", category: "conflict_style" },
    { id: 7, text: "Talking to people energizes me.", category: "extraversion" },
    { id: 8, text: "I like routines and structure.", category: "conscientiousness" },
    { id: 9, text: "I stick to my goals consistently.", category: "conscientiousness" },
    { id: 10, text: "I enjoy exploring new ideas and emotions.", category: "openness" },
    { id: 11, text: "I often worry about things.", category: "neuroticism" },
    { id: 12, text: "I prefer deep conversations over small talk.", category: "openness" }
];

const sliderLabels = ['🌑', '🌘', '🌗', '🌖', '🌕'];

export default function PersonalityTestScreen({ onNext }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedValue, setSelectedValue] = useState(2); // Default to middle

    const handleNext = () => {
        const newAnswers = [...answers, { questionId: questions[currentQuestion].id, value: selectedValue }];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedValue(2); // Reset to middle
        } else {
            onNext(newAnswers);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-2xl w-full space-y-8">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-slide-in">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {questions[currentQuestion].text}
                    </h3>

                    {/* Slider */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            {sliderLabels.map((label, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedValue(idx)}
                                    className={`text-4xl transition-all ${selectedValue === idx ? 'scale-125' : 'scale-100 opacity-50'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="4"
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Strongly Disagree</span>
                            <span>Strongly Agree</span>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className="w-full mt-8 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        {currentQuestion < questions.length - 1 ? 'Next' : 'Continue'}
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(to right, #fb7185, #f43f5e);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(to right, #fb7185, #f43f5e);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
        }
      `}</style>
        </div>
    );
}
