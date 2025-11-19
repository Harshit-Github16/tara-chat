#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Revert primary colors back to rose
const colorMappings = {
    // Backgrounds
    'bg-primary-50': 'bg-rose-50',
    'bg-primary-100': 'bg-rose-100',
    'bg-primary-200': 'bg-rose-200',
    'bg-primary-300': 'bg-rose-300',
    'bg-primary-400': 'bg-rose-400',
    'bg-primary-500': 'bg-rose-500',
    'bg-primary-600': 'bg-rose-600',

    // Text colors
    'text-primary-50': 'text-rose-50',
    'text-primary-100': 'text-rose-100',
    'text-primary-200': 'text-rose-200',
    'text-primary-300': 'text-rose-300',
    'text-primary-400': 'text-rose-400',
    'text-primary-500': 'text-rose-500',
    'text-primary-600': 'text-rose-600',
    'text-primary-700': 'text-rose-700',

    // Borders
    'border-primary-50': 'border-rose-50',
    'border-primary-100': 'border-rose-100',
    'border-primary-200': 'border-rose-200',
    'border-primary-300': 'border-rose-300',
    'border-primary-400': 'border-rose-400',
    'border-primary-500': 'border-rose-500',

    // Gradients
    'from-primary-50': 'from-rose-50',
    'from-primary-100': 'from-rose-100',
    'from-primary-200': 'from-rose-200',
    'to-primary-50': 'to-rose-50',
    'to-primary-100': 'to-rose-100',
    'to-primary-200': 'to-rose-200',
    'via-primary-50': 'via-rose-50',
    'via-primary-100': 'via-rose-100',

    // Hover states
    'hover:bg-primary-50': 'hover:bg-rose-50',
    'hover:bg-primary-100': 'hover:bg-rose-100',
    'hover:bg-primary-200': 'hover:bg-rose-200',
    'hover:text-primary-500': 'hover:text-rose-500',
    'hover:text-primary-600': 'hover:text-rose-600',
    'hover:text-primary-700': 'hover:text-rose-700',
    'hover:border-primary-300': 'hover:border-rose-300',

    // Focus states
    'focus:border-primary-300': 'focus:border-rose-300',
    'focus:border-primary-400': 'focus:border-rose-400',
    'focus:ring-primary-100': 'focus:ring-rose-100',

    // Ring colors
    'ring-primary-100': 'ring-rose-100',
    'ring-primary-200': 'ring-rose-200',

    // Border-t (for spinners)
    'border-t-primary-500': 'border-t-rose-500',
    'border-t-primary-600': 'border-t-rose-600',
};

function shouldExcludeFile(filePath) {
    if (filePath === 'app/page.js' || filePath === 'app\\page.js') return true;
    if (filePath.includes('/login/') || filePath.includes('/signup/') ||
        filePath.includes('\\login\\') || filePath.includes('\\signup\\')) return true;
    if (filePath.includes('node_modules') || filePath.includes('.next')) return true;
    return false;
}

function updateFile(filePath) {
    if (shouldExcludeFile(filePath)) {
        return;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        for (const [oldColor, newColor] of Object.entries(colorMappings)) {
            if (content.includes(oldColor)) {
                const regex = new RegExp(oldColor, 'g');
                content = content.replace(regex, newColor);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Reverted: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error: ${filePath}:`, error.message);
    }
}

function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!shouldExcludeFile(filePath)) {
                walkDirectory(filePath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            updateFile(filePath);
        }
    });
}

console.log('🔄 Reverting to original rose colors...\n');
walkDirectory('app');
console.log('\n✅ Reverted back to rose colors!');
