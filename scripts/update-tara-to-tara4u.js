#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'app/terms-of-service/page.js',
    'app/blog/page.js',
    'app/blog/[id]/page.js',
    'app/profile/page.js',
    'app/goals/page.js',
    'app/privacy-policy/page.js',
    'app/about/page.js',
    'app/contact/page.js',
    'app/journal/page.js',
    'app/insights/page.js',
    'app/chatlist/page.js',
];

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Replace "Tara</span>" with "Tara4U</span>" in navbar
        if (content.includes('text-rose-600">Tara</span>')) {
            content = content.replace(
                /text-rose-600">Tara<\/span>/g,
                'text-rose-600">Tara4U</span>'
            );
            modified = true;
        }

        // Also replace in base/sm text variants
        if (content.includes('text-base sm:text-lg font-semibold text-rose-600">Tara</span>')) {
            content = content.replace(
                /text-base sm:text-lg font-semibold text-rose-600">Tara<\/span>/g,
                'text-base sm:text-lg font-semibold text-rose-600">Tara4U</span>'
            );
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
        } else {
            console.log(`⏭️  No changes: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

console.log('🔄 Updating "Tara" to "Tara4U" in navbar...\n');

filesToUpdate.forEach(file => {
    if (fs.existsSync(file)) {
        updateFile(file);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log('\n✅ Update complete!');
