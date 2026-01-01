"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ExitIntent() {
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [hasShownBefore, setHasShownBefore] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pageLoadTimeRef = useRef(Date.now());

    // Only run on client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Memoized handlers to prevent recreation on every render
    const handleMouseLeave = useCallback((e) => {
        // Only trigger if mouse is moving towards the top of the screen and minimum time has passed
        if (e.clientY <= 0 && !hasShownBefore && !showExitIntent) {
            // Check if minimum time on page has passed (5 seconds)
            const timeOnPage = Date.now() - pageLoadTimeRef.current;
            if (timeOnPage < 5000) {
                return; // Not enough time on page
            }

            const timer = setTimeout(() => {
                setShowExitIntent(true);
                setHasShownBefore(true);
                try {
                    sessionStorage.setItem('exitIntentShown', 'true');
                } catch (error) {
                    console.warn('SessionStorage not available:', error);
                }
            }, 100);

            // Store timer for cleanup
            return () => clearTimeout(timer);
        }
    }, [hasShownBefore, showExitIntent]);

    const handleMouseEnter = useCallback(() => {
        // This can be used to cancel any pending timers if needed
    }, []);

    useEffect(() => {
        // Only run if we're on the client
        if (!isClient) return;

        // Check if already shown in this session
        try {
            const exitIntentShown = sessionStorage.getItem('exitIntentShown');
            if (exitIntentShown) {
                setHasShownBefore(true);
                return;
            }
        } catch (error) {
            console.warn('SessionStorage not available:', error);
        }

        // Don't show on certain pages
        const currentPath = window.location.pathname;
        const excludedPaths = ['/chatlist', '/chat/', '/admin', '/profile', '/journal', '/goals', '/insights', '/login', '/welcome', '/onboarding'];
        const shouldExclude = excludedPaths.some(path => currentPath.includes(path));

        if (shouldExclude) {
            return;
        }

        // Add a minimum time on page before showing exit intent (5 seconds)
        const minTimeOnPage = 5000;
        const pageLoadTime = Date.now();

        const checkMinTime = () => {
            return Date.now() - pageLoadTime >= minTimeOnPage;
        };

        // Add event listeners
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        // Cleanup
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [isClient, handleMouseLeave, handleMouseEnter]);

    const handleClose = useCallback(() => {
        setShowExitIntent(false);
    }, []);

    const handleStayAndChat = useCallback(() => {
        setShowExitIntent(false);
        // Use Next.js router instead of window.location for better performance
        if (typeof window !== 'undefined') {
            window.location.href = '/welcome';
        }
    }, []);

    // Memoized random message to prevent re-rendering
    const randomMessage = useState(() => {
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
        return messages[Math.floor(Math.random() * messages.length)];
    })[0];

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showExitIntent) {
                handleClose();
            }
        };

        if (showExitIntent) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showExitIntent, handleClose]);

    // Don't render anything on server or if not showing
    if (!isClient || !showExitIntent) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            onClick={(e) => {
                // Close if clicking on backdrop
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        aria-label="Close exit intent popup"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 id="exit-intent-title" className="text-xl font-bold">{randomMessage.title}</h3>
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