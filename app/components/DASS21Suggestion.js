'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Activity, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * DASS-21 Suggestion Component
 * Shows when pattern analysis detects consistent stress
 */
export default function DASS21Suggestion({
    patternInfo,
    onDismiss,
    onTakeAssessment
}) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    const handleTakeAssessment = () => {
        if (onTakeAssessment) {
            onTakeAssessment();
        } else {
            router.push('/dass21');
        }
    };

    if (!isVisible) return null;

    const { stressScore, confidence, consecutiveStressedDays } = patternInfo || {};

    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 mb-4 shadow-sm">
            {/* Close button */}
            <button
                onClick={handleDismiss}
                className="float-right text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Dismiss"
            >
                <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
                    <Activity className="text-purple-600 dark:text-purple-300" size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Mental Health Check-In Suggested
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Main notice kar rahi hoon ki aap pichle kuch dino se thoda stressed lag rahe hain.
                        Ek quick assessment lene se hum aapki better help kar sakte hain.
                    </p>
                </div>
            </div>

            {/* Pattern Info */}
            {patternInfo && (
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    {consecutiveStressedDays > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                <TrendingUp size={12} />
                                <span>Pattern Detected</span>
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                                {consecutiveStressedDays} consecutive days
                            </div>
                        </div>
                    )}
                    {confidence && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                <AlertCircle size={12} />
                                <span>Confidence</span>
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                                {confidence}%
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* What is DASS-21 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 text-sm">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                    DASS-21 Assessment kya hai?
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Ye ek scientifically validated questionnaire hai jo aapke depression, anxiety,
                    aur stress levels ko measure karti hai. Sirf 5 minute lagenge! 🌟
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleTakeAssessment}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
                >
                    Take Assessment (5 min)
                </button>
                <button
                    onClick={handleDismiss}
                    className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                    Maybe Later
                </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                🔒 Your responses are completely private and secure
            </p>
        </div>
    );
}
