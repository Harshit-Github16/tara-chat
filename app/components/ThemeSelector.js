'use client';

import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ThemeSelector() {
    const { currentTheme, changeTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themePreview = {
        rose: '#f43f5e',
        purple: '#a855f7',
        blue: '#3b82f6',
        green: '#22c55e',
        orange: '#f97316',
        pink: '#ec4899',
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-colors"
            >
                <FontAwesomeIcon icon={faPalette} className="h-4 w-4" />
                <span className="hidden sm:inline">Theme</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-white shadow-xl border border-rose-100 p-3 animate-slide-up">
                        <p className="text-xs font-semibold text-gray-500 mb-3 px-2">Choose Your Theme</p>

                        <div className="space-y-1">
                            {Object.entries(themes).map(([key, theme]) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        console.log('Theme clicked:', key); // Debug
                                        changeTheme(key);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentTheme === key
                                        ? 'bg-rose-50 border border-rose-200'
                                        : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                >
                                    {/* Color Preview */}
                                    <div
                                        className="w-6 h-6 rounded-full shadow-sm border-2 border-white"
                                        style={{ backgroundColor: themePreview[key] }}
                                    />

                                    {/* Theme Info */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {theme.name}
                                            </span>
                                            <span className="text-base">{theme.icon}</span>
                                        </div>
                                    </div>

                                    {/* Check Mark */}
                                    {currentTheme === key && (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="h-3.5 w-3.5 text-rose-600"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Theme applies to entire app
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
