"use client";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ExitIntent() {
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [hasShownBefore, setHasShownBefore] = useState(false);

    useEffect(() => {
        // Check if exit intent was already shown in this session
        const exitIntentShown = sessionStorage.getItem('exitIntentShown');
        if (exitIntentShown) {
            setHasShownBefore(true);
            return;
        }

        // Don't show on certain pages where it might be intrusive
        const currentPath = window.location.pathname;
        const excludedPaths = ['/chatlist', '/chat/', '/admin'];
        const shouldExclude = excludedPaths.some(path => currentPath.includes(path));

        if (shouldExclude) {
            return;
        }

        let mouseLeaveTimer;

        const handleMouseLeave = (e) => {
            // Only trigger if mouse is moving towards the top of the screen (exit intent)
            if (e.clientY <= 0 && !hasShownBefore && !showExitIntent) {
                mouseLeaveTimer = setTimeout(() => {
                    setShowExitIntent(true);
                    setHasShownBefore(true);
                    // Mark as shown in session storage
                    sessionStorage.setItem('exitIntentShown', 'true');
                }, 100);
            }
        };

        const handleMouseEnter = () => {
            if (mouseLeaveTimer) {
                clearTimeout(mouseLeaveTimer);
            }
        };

        // Add event listeners
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        // Cleanup
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            if (mouseLeaveTimer) {
                clearTimeout(mouseLeaveTimer);
            }
        };
    }, [hasShownBefore, showExitIntent]);

    const handleClose = () => {
        setShowExitIntent(false);
    };

    const handleStayAndChat = () => {
        setShowExitIntent(false);
        // Redirect to chat
        window.location.href = '/chatlist';
    };

    // Random messages for variety
    const messages = [
        {
            title: "Wait! 💕",
            subtitle: "Tara is waiting to talk to you",
            content: "Your mental wellness journey matters. Tara is here to listen, support, and help you feel better.",
            highlight: "Take a moment to share what's on your mind.",
            emoji: "🤗"
        },
        {
            title: "Before you go... 🌟",
            subtitle: "Tara wants to help you today",
            content: "Sometimes a quick chat can turn your whole day around. Tara understands what you're going through.",
            highlight: "Let's talk about what's on your heart.",
            emoji: "💝"
        },
        {
            title: "Hold on! 🌸",
            subtitle: "Your wellbeing matters to us",
            content: "You don't have to face your challenges alone. Tara is here 24/7 to provide support and understanding.",
            highlight: "Share your thoughts in a safe space.",
            emoji: "🫂"
        }
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    if (!showExitIntent) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-bounce-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{randomMessage.title}</h3>
                            <p className="text-white/90 text-sm">{randomMessage.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-3">{randomMessage.emoji}</div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            Don't leave just yet!
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {randomMessage.content}
                            <span className="font-medium text-rose-600"> {randomMessage.highlight}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleStayAndChat}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            💬 Yes, let's chat with Tara
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-full font-medium hover:bg-gray-200 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>

                    {/* Small encouragement */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            ✨ Just 2 minutes can make a difference in your day
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}