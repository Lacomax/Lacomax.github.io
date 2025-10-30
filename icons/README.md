# PWA Icons

This directory contains icons for the Progressive Web App (PWA) in multiple sizes.

## Required Sizes

For full PWA compatibility, the following icon sizes are needed:

- `icon-16x16.png` - Browser favicon
- `icon-32x32.png` - Browser favicon
- `icon-72x72.png` - iOS home screen (iPad mini, etc.)
- `icon-96x96.png` - Android home screen
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iOS home screen (iPad)
- `icon-180x180.png` - iOS home screen (iPhone)
- `icon-192x192.png` - Android home screen (recommended)
- `icon-384x384.png` - Android splash screen
- `icon-512x512.png` - Android home screen (high-res), PWA install

## How to Generate Icons

### Option 1: Online Tools (Recommended for Quick Setup)

1. **PWA Asset Generator**
   - Visit: https://www.pwabuilder.com/imageGenerator
   - Upload a single high-resolution image (1024x1024 PNG recommended)
   - Download the generated icon pack
   - Extract files to this directory

2. **RealFaviconGenerator**
   - Visit: https://realfavicongenerator.net/
   - Upload your master image
   - Configure options for different platforms
   - Download and extract to this directory

### Option 2: ImageMagick (Command Line)

If you have a source image called `source-icon.png` (1024x1024 or larger):

```bash
# Install ImageMagick
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick
# Windows: https://imagemagick.org/script/download.php

# Generate all sizes
convert source-icon.png -resize 16x16 icon-16x16.png
convert source-icon.png -resize 32x32 icon-32x32.png
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 180x180 icon-180x180.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 512x512 icon-512x512.png
```

### Option 3: Node.js Script

```javascript
// generate-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const sourceIcon = 'source-icon.png';
const outputDir = './icons';

async function generateIcons() {
    for (const size of sizes) {
        await sharp(sourceIcon)
            .resize(size, size)
            .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
        console.log(`Generated icon-${size}x${size}.png`);
    }
}

generateIcons().catch(console.error);
```

Install dependencies and run:
```bash
npm install sharp
node generate-icons.js
```

## Design Guidelines

### Best Practices

1. **Simple and Clear**: Icons should be recognizable at small sizes
2. **High Contrast**: Ensure good visibility on various backgrounds
3. **Centered Design**: Leave some padding around the edges
4. **Consistent Branding**: Match your app's visual identity
5. **Test on Devices**: Check how icons look on actual devices

### Safe Zone

- Leave 10% padding on all sides
- For a 512x512 icon, keep important content within the central 410x410 area
- This prevents clipping on rounded icon masks (Android adaptive icons)

### Color Considerations

- Avoid pure white or black backgrounds
- Use your app's primary brand color
- Ensure good contrast with both light and dark mode backgrounds
- Consider how the icon looks with shadow effects

## Temporary Placeholder

If you don't have custom icons yet, you can use the existing `favicon.ico` as a starting point or create a simple text-based icon:

```html
<!-- SVG placeholder -->
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#66b3ff"/>
  <text x="256" y="320" font-size="200" fill="white" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">V</text>
</svg>
```

Save as `icon-source.svg` and convert to PNG using tools mentioned above.

## Verification

After generating icons, verify they're working:

1. Open your site in Chrome DevTools
2. Go to Application → Manifest
3. Check that all icons are loading correctly
4. Install the PWA and verify the icon appears correctly on your home screen

## Maskable Icons

For Android adaptive icons, create maskable versions:

- Larger safe zone (20% padding instead of 10%)
- Full-bleed design that looks good when clipped
- Mark in manifest.json with `"purpose": "maskable"`

## Resources

- [PWA Icon Guidelines](https://web.dev/add-manifest/#icons)
- [Maskable.app Editor](https://maskable.app/editor)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [iOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)
