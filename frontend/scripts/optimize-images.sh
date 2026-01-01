#!/bin/bash

# Image Optimization Script for Tara4u
# This script helps identify large images and provides optimization commands

echo "🔍 Scanning for large images..."
echo ""

# Find images larger than 100KB
echo "📊 Images larger than 100KB:"
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +100k -exec ls -lh {} \; | awk '{print $9, $5}'

echo ""
echo "💡 Optimization Recommendations:"
echo ""
echo "For JPEG/JPG files:"
echo "  npm install -g sharp-cli"
echo "  sharp -i input.jpg -o output.jpg --quality 80 --progressive"
echo ""
echo "For PNG files:"
echo "  npm install -g pngquant-bin"
echo "  pngquant --quality=65-80 input.png --output output.png"
echo ""
echo "Convert to WebP (recommended):"
echo "  sharp -i input.jpg -o output.webp --quality 80"
echo ""
echo "Convert to AVIF (best compression):"
echo "  sharp -i input.jpg -o output.avif --quality 80"
echo ""
echo "🚀 Quick optimization for all images in public folder:"
echo "  npm run optimize:images"
echo ""
