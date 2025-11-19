'use client';

import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

export default function TestThemePage() {
    const { currentTheme, changeTheme, themes } = useTheme();
    const [cssVars, setCssVars] = useState({});

    useEffect(() => {
        // Read current CSS variables
        const root = document.documentElement;
        const vars = {};
        for (let i = 50; i <= 700; i += 50) {
            if (i <= 700) {
                vars[`rose-${i}`] = getComputedStyle(root).getPropertyValue(`--rose-${i}`);
            }
        }
        setCssVars(vars);
    }, [currentTheme]);

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-rose-600 mb-8">Theme Test Page</h1>

                {/* Current Theme */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-rose-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Theme</h2>
                    <p className="text-2xl font-bold text-rose-600">{currentTheme}</p>
                </div>

                {/* Theme Buttons */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-rose-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Theme</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(themes).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    console.log('Changing to:', key);
                                    changeTheme(key);
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${currentTheme === key
                                    ? 'border-rose-500 bg-rose-50'
                                    : 'border-gray-200 hover:border-rose-300'
                                    }`}
                            >
                                <div className="text-2xl mb-2">{theme.icon}</div>
                                <div className="font-semibold">{theme.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CSS Variables */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-rose-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">CSS Variables</h2>
                    <div className="space-y-2 font-mono text-sm">
                        {Object.entries(cssVars).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded border"
                                    style={{ backgroundColor: value }}
                                />
                                <span className="text-gray-600">--{key}:</span>
                                <span className="text-rose-600">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color Samples */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Samples</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg">
                            <p className="text-rose-600 font-semibold">bg-rose-50 / text-rose-600</p>
                        </div>
                        <div className="p-4 bg-rose-100 border border-rose-200 rounded-lg">
                            <p className="text-rose-700 font-semibold">bg-rose-100 / text-rose-700</p>
                        </div>
                        <button className="w-full p-4 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600">
                            bg-rose-500 Button
                        </button>
                        <div className="p-4 bg-gradient-to-r from-rose-400 to-rose-600 text-white rounded-lg">
                            <p className="font-semibold">Gradient: from-rose-400 to-rose-600</p>
                        </div>
                    </div>
                </div>

                {/* localStorage */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-rose-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">localStorage</h2>
                    <p className="font-mono text-sm">
                        tara-theme: <span className="text-rose-600">{localStorage.getItem('tara-theme') || 'not set'}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
