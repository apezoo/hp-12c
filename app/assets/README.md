# Assets Directory

This directory contains static assets for the HP-12C Calculator application.

## Required Files

To make this app PWA-ready, please add the following files to this directory:

### Icons
- `favicon.ico` - Browser favicon (16x16, 32x32)
- `icon-192.png` - PWA icon (192x192 pixels)
- `icon-512.png` - PWA icon (512x512 pixels)
- `apple-touch-icon.png` - iOS home screen icon (180x180 pixels)

### Screenshots (Optional)
- `screenshot.png` - App screenshot for PWA manifest (1280x800 pixels recommended)

## Generating Icons

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

Or use ImageMagick:
```bash
# From a source image (e.g., logo.png)
convert logo.png -resize 192x192 icon-192.png
convert logo.png -resize 512x512 icon-512.png
convert logo.png -resize 16x16 -colors 256 favicon.ico
```

## Current Status
This directory currently contains placeholder files. Add your custom icons to enable full PWA functionality.
