// Utility to generate theme-aware Tailwind classes
// Use this instead of hardcoded rose/pink colors

export const theme = {
    // Backgrounds
    bg: {
        light: 'bg-rose-50',
        base: 'bg-rose-500',
        gradient: 'bg-gradient-to-br from-rose-50 via-white to-rose-100',
        gradientR: 'bg-gradient-to-r from-rose-50 to-rose-100',
    },

    // Text colors
    text: {
        primary: 'text-rose-500',
        dark: 'text-rose-600',
        light: 'text-rose-400',
    },

    // Borders
    border: {
        light: 'border-rose-100',
        base: 'border-rose-200',
        focus: 'focus:border-rose-300',
    },

    // Buttons
    button: {
        primary: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
        outline: 'border border-rose-200 text-rose-500 hover:bg-rose-50',
    },

    // Rings
    ring: {
        base: 'ring-rose-100',
    },

    // Spinners/Loaders
    spinner: 'border-rose-200 border-t-rose-500',
};

// Helper function to combine classes
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
