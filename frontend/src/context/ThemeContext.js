'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    rose: {
        name: 'Rose',
        icon: '🌹',
        colors: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c',
        }
    },
    purple: {
        name: 'Purple',
        icon: '💜',
        colors: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
        }
    },
    blue: {
        name: 'Blue',
        icon: '💙',
        colors: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
        }
    },
    green: {
        name: 'Green',
        icon: '💚',
        colors: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
        }
    },
    orange: {
        name: 'Orange',
        icon: '🧡',
        colors: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
        }
    },
    pink: {
        name: 'Pink',
        icon: '💗',
        colors: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
        }
    },
};

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState('rose');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Only access localStorage in the browser
        if (typeof window !== 'undefined') {
            // Load theme from localStorage
            const savedTheme = localStorage.getItem('tara-theme');
            if (savedTheme && themes[savedTheme]) {
                setCurrentTheme(savedTheme);
                applyTheme(savedTheme);
            } else {
                // Apply default rose theme on first load
                applyTheme('rose');
            }
        }
    }, []);

    const applyTheme = (themeName) => {
        const theme = themes[themeName];
        if (!theme || typeof window === 'undefined') return;

        const root = document.documentElement;
        const colors = theme.colors;

        console.log('Applying theme:', themeName, colors); // Debug log

        // Update all rose color shades
        Object.entries(colors).forEach(([shade, color]) => {
            root.style.setProperty(`--rose-${shade}`, color);
            console.log(`Set --rose-${shade} to ${color}`); // Debug log
        });

        // Also update pink colors to match (for consistency)
        Object.entries(colors).forEach(([shade, color]) => {
            root.style.setProperty(`--pink-${shade}`, color);
        });

        // Update gradients to use new colors
        root.style.setProperty('--gradient-main', `linear-gradient(to bottom right, ${colors[50]}, white, ${colors[100]})`);
        root.style.setProperty('--gradient-light', `linear-gradient(to bottom right, ${colors[50]}, white, ${colors[50]})`);
        root.style.setProperty('--gradient-header', `linear-gradient(to right, ${colors[50]}, ${colors[100]})`);
        root.style.setProperty('--gradient-button', `linear-gradient(to right, ${colors[400]}, ${colors[600]})`);
        root.style.setProperty('--gradient-card', `linear-gradient(to bottom right, ${colors[50]}, ${colors[100]})`);
        root.style.setProperty('--gradient-stats', `linear-gradient(to right, ${colors[50]}, #fce7f3)`);

        // Update radial gradients
        root.style.setProperty('--radial-gradient-1', `radial-gradient(circle at 30% 20%, ${colors[500]}, transparent 50%)`);
        root.style.setProperty('--radial-gradient-2', `radial-gradient(circle at 70% 80%, ${colors[500]}, transparent 50%)`);
        root.style.setProperty('--radial-gradient-3', `radial-gradient(circle at 50% 50%, ${colors[500]}, transparent 70%)`);
        root.style.setProperty('--radial-gradient-4', `radial-gradient(circle at 20% 50%, ${colors[500]}, transparent 50%)`);
        root.style.setProperty('--radial-gradient-5', `radial-gradient(circle at 80% 20%, ${colors[500]}, transparent 50%)`);

        console.log('Theme applied successfully!'); // Debug log
    };

    const changeTheme = (themeName) => {
        if (themes[themeName]) {
            setCurrentTheme(themeName);
            applyTheme(themeName);
            // Only access localStorage in the browser
            if (typeof window !== 'undefined') {
                localStorage.setItem('tara-theme', themeName);
            }
        }
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
