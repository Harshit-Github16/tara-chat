# Favicon Setup Instructions

## Required Favicon Files

Place these files in the `public/` directory:

### 1. favicon.ico
- Size: 32x32 or 48x48 pixels
- Format: ICO
- Location: `/public/favicon.ico`

### 2. favicon-16x16.png
- Size: 16x16 pixels
- Format: PNG
- Location: `/public/favicon-16x16.png`

### 3. favicon-32x32.png
- Size: 32x32 pixels
- Format: PNG
- Location: `/public/favicon-32x32.png`

### 4. apple-touch-icon.png
- Size: 180x180 pixels
- Format: PNG
- Location: `/public/apple-touch-icon.png`

### 5. android-chrome-192x192.png
- Size: 192x192 pixels
- Format: PNG
- Location: `/public/android-chrome-192x192.png`

### 6. android-chrome-512x512.png
- Size: 512x512 pixels
- Format: PNG
- Location: `/public/android-chrome-512x512.png`

### 7. og-image.jpg (Open Graph Image)
- Size: 1200x630 pixels
- Format: JPG
- Location: `/public/og-image.jpg`
- Use: Social media sharing preview

### 8. safari-pinned-tab.svg (Optional)
- Format: SVG (monochrome)
- Location: `/public/safari-pinned-tab.svg`

## How to Generate Favicons

### Option 1: Use Online Tool
1. Go to https://realfavicongenerator.net/
2. Upload your Tara logo (taralogo.jpg)
3. Customize settings:
   - iOS: Use rose color (#f43f5e)
   - Android: Use rose color
   - Windows: Use rose color
4. Download the package
5. Extract files to `/public/` directory

### Option 2: Use Favicon Generator
1. Go to https://favicon.io/
2. Upload taralogo.jpg
3. Download generated files
4. Place in `/public/` directory

## Current Logo
- Source: `/public/taralogo.jpg`
- Use this as base for all favicon generation

## Verification
After adding files, verify at:
- https://tara4u.com/favicon.ico
- https://tara4u.com/apple-touch-icon.png
- https://tara4u.com/android-chrome-512x512.png

## Testing
1. Clear browser cache
2. Visit https://tara4u.com
3. Check browser tab icon
4. Test on mobile (iOS/Android)
5. Share link on social media to test OG image
