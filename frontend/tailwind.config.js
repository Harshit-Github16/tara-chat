/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Rose colors mapped to CSS variables with rgb() for opacity support
                rose: {
                    50: 'rgb(var(--rose-50) / <alpha-value>)',
                    100: 'rgb(var(--rose-100) / <alpha-value>)',
                    200: 'rgb(var(--rose-200) / <alpha-value>)',
                    300: 'rgb(var(--rose-300) / <alpha-value>)',
                    400: 'rgb(var(--rose-400) / <alpha-value>)',
                    500: 'rgb(var(--rose-500) / <alpha-value>)',
                    600: 'rgb(var(--rose-600) / <alpha-value>)',
                    700: 'rgb(var(--rose-700) / <alpha-value>)',
                    800: 'rgb(var(--rose-800) / <alpha-value>)',
                    900: 'rgb(var(--rose-900) / <alpha-value>)',
                },
                // Pink colors mapped to CSS variables
                pink: {
                    50: 'rgb(var(--pink-50) / <alpha-value>)',
                    100: 'rgb(var(--pink-100) / <alpha-value>)',
                    200: 'rgb(var(--pink-200) / <alpha-value>)',
                    300: 'rgb(var(--pink-300) / <alpha-value>)',
                    400: 'rgb(var(--pink-400) / <alpha-value>)',
                    500: 'rgb(var(--pink-500) / <alpha-value>)',
                    600: 'rgb(var(--pink-600) / <alpha-value>)',
                    700: 'rgb(var(--pink-700) / <alpha-value>)',
                },
            },
        },
    },
    plugins: [],
};
