const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
    { input: 'public/taralogo.jpg', quality: 85 },
    { input: 'public/blog1.png', quality: 80 },
    { input: 'public/faqimg.jpg', quality: 75 },
    { input: 'public/icon.png', quality: 85 },
    { input: 'public/apple-icon.png', quality: 85 },
    { input: 'public/icon-192x192.png', quality: 85 },
    { input: 'public/icon-384x384.png', quality: 85 },
    { input: 'public/icon-512x512.png', quality: 85 },
];

async function optimizeImage(inputPath, quality) {
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const dirName = path.dirname(inputPath);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        console.log(`\n📸 Optimizing: ${inputPath}`);
        console.log(`   Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB`);
        console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);

        // Generate WebP
        const webpPath = path.join(dirName, `${baseName}.webp`);
        await image
            .webp({ quality, effort: 6 })
            .toFile(webpPath);

        const webpSize = fs.statSync(webpPath).size / 1024;
        console.log(`   ✅ WebP created: ${webpSize.toFixed(2)} KB (${webpPath})`);

        // Generate AVIF (best compression)
        const avifPath = path.join(dirName, `${baseName}.avif`);
        await image
            .avif({ quality, effort: 6 })
            .toFile(avifPath);

        const avifSize = fs.statSync(avifPath).size / 1024;
        console.log(`   ✅ AVIF created: ${avifSize.toFixed(2)} KB (${avifPath})`);

        // Calculate savings
        const originalSize = fs.statSync(inputPath).size / 1024;
        const savings = ((originalSize - avifSize) / originalSize * 100).toFixed(1);
        console.log(`   💰 Savings: ${savings}% with AVIF`);

    } catch (error) {
        console.error(`   ❌ Error optimizing ${inputPath}:`, error.message);
    }
}

async function main() {
    console.log('🚀 Starting image optimization...\n');
    console.log('This will create WebP and AVIF versions of your images.');
    console.log('Original files will be preserved.\n');

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const { input, quality } of imagesToOptimize) {
        if (fs.existsSync(input)) {
            await optimizeImage(input, quality);
            totalOriginalSize += fs.statSync(input).size;

            const ext = path.extname(input);
            const baseName = path.basename(input, ext);
            const dirName = path.dirname(input);
            const avifPath = path.join(dirName, `${baseName}.avif`);

            if (fs.existsSync(avifPath)) {
                totalOptimizedSize += fs.statSync(avifPath).size;
            }
        } else {
            console.log(`⚠️  File not found: ${input}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total original size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`Total optimized size (AVIF): ${(totalOptimizedSize / 1024).toFixed(2)} KB`);
    console.log(`Total savings: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(2)} KB`);
    console.log(`Percentage saved: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    console.log('\n✨ Next steps:');
    console.log('1. Update your code to use WebP/AVIF images');
    console.log('2. Use <picture> element for fallbacks:');
    console.log(`
<picture>
  <source srcSet="/taralogo.avif" type="image/avif" />
  <source srcSet="/taralogo.webp" type="image/webp" />
  <img src="/taralogo.jpg" alt="Tara Logo" />
</picture>
  `);
    console.log('3. Or use Next.js Image component (it handles this automatically!)');
}

main().catch(console.error);
