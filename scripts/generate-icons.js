const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [192, 384, 512];
const inputIcon = path.join(__dirname, '../app/icon.png');

async function generateIcons() {
    console.log('🎨 Generating PWA icons...\n');

    if (!fs.existsSync(inputIcon)) {
        console.error('❌ Error: app/icon.png not found!');
        process.exit(1);
    }

    for (const size of sizes) {
        const outputPath = path.join(__dirname, `../public/icon-${size}x${size}.png`);
        await sharp(inputIcon)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .toFile(outputPath);
        console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    console.log('\n✨ All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
