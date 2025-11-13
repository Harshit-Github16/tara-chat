const fs = require('fs');
const path = require('path');

console.log('🔍 Checking PWA Setup...\n');

const checks = [
    {
        name: 'Manifest file',
        path: 'public/manifest.json',
        required: true,
    },
    {
        name: 'Service worker source',
        path: 'app/sw.js',
        required: true,
    },
    {
        name: 'PWA icon 192x192',
        path: 'public/icon-192x192.png',
        required: true,
    },
    {
        name: 'PWA icon 384x384',
        path: 'public/icon-384x384.png',
        required: true,
    },
    {
        name: 'PWA icon 512x512',
        path: 'public/icon-512x512.png',
        required: true,
    },
    {
        name: 'Offline page',
        path: 'app/offline/page.js',
        required: true,
    },
    {
        name: 'Install prompt component',
        path: 'app/components/PWAInstallPrompt.js',
        required: true,
    },
];

let allPassed = true;

checks.forEach(check => {
    const fullPath = path.join(process.cwd(), check.path);
    const exists = fs.existsSync(fullPath);

    if (exists) {
        console.log(`✅ ${check.name}`);
    } else {
        console.log(`❌ ${check.name} - Missing: ${check.path}`);
        if (check.required) allPassed = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('✨ All PWA files are in place!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: npm start');
    console.log('3. Open: http://localhost:3000');
    console.log('4. Check DevTools → Application → Manifest');
} else {
    console.log('⚠️  Some required files are missing.');
    console.log('Please check the errors above.');
    process.exit(1);
}
