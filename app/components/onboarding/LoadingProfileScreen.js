'use client';

import { useEffect } from 'react';

export default function LoadingProfileScreen({ onComplete }) {
    useEffect(() => {
        // Simulate profile creation for 3 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-lg text-center space-y-8">
                {/* Breathing Circle Animation */}
                <div className="relative mx-auto w-48 h-48">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-breathing"></div>
                    <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Just a moment...
                    </h2>
                    <p className="text-lg text-gray-700 animate-pulse">
                        I'm understanding your emotional patterns and support style.
                    </p>
                </div>

                {/* Loading Dots */}
                <div className="flex justify-center gap-2">
                    <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>

            <style jsx>{`
        @keyframes breathing {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.1);
            opacity: 1;
          }
        }
        
        .animate-breathing {
          animation: breathing 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
