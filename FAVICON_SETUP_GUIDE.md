# Favicon Setup Guide

This guide will help you create proper favicon files from your logo for the AutoHub website.

## Quick Setup (Using the Script)

### Step 1: Install Required Package

```bash
npm install --save-dev sharp
```

### Step 2: Place Your Logo

1. Copy your logo file (`WhatsApp Image 2025-12-12 at 8.06.44 AM.jpeg`) to the `public` folder
2. Rename it to `autohub-logo-source.jpeg`

### Step 3: Run the Script

```bash
node scripts/generate-favicon.js
```

This will generate all required favicon files:
- `favicon.ico` (16x16 and 32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `favicon-64x64.png`
- `favicon-96x96.png`
- `favicon-128x128.png`
- `apple-touch-icon.png` (192x192)
- `favicon-512x512.png`
- `autohub-logo.jpeg` (optimized for navbar)

### Step 4: Verify

The code is already configured to use these files. Just restart your dev server:

```bash
npm run dev
```

Check the browser tab - you should see your favicon!

---

## Manual Setup (Using Online Tools)

If you prefer to use online tools:

### Option 1: RealFaviconGenerator.net

1. Go to https://realfavicongenerator.net/
2. Upload your logo image
3. Configure settings:
   - iOS: Enable "Apple touch icon"
   - Android: Enable "Android Chrome"
   - Windows: Enable "Windows Metro"
4. Generate and download the favicon package
5. Extract files to the `public/` folder
6. Make sure these files exist:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (or `apple-touch-icon-180x180.png`)

### Option 2: Favicon.io

1. Go to https://favicon.io/
2. Upload your logo
3. Download the generated favicon package
4. Extract to `public/` folder

---

## File Structure

After setup, your `public/` folder should contain:

```
public/
├── favicon.ico                    # Main favicon (required)
├── favicon-16x16.png             # Small favicon
├── favicon-32x32.png             # Standard favicon
├── favicon-96x96.png             # Large favicon
├── apple-touch-icon.png          # iOS home screen icon
├── autohub-logo.jpeg             # Main logo for navbar
└── autohub-logo-source.jpeg      # Source file (can be deleted after)
```

---

## Testing

1. **Browser Tab**: Check if favicon appears in browser tab
2. **Bookmarks**: Add to bookmarks and check icon
3. **Mobile**: Add to home screen on iOS/Android and verify icon
4. **Dev Tools**: 
   - Open browser DevTools
   - Go to Network tab
   - Reload page
   - Check if favicon files load (status 200)

---

## Troubleshooting

### Favicon not showing?

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check file paths**: Ensure files are in `public/` folder
3. **Check file names**: Must match exactly (case-sensitive)
4. **Restart dev server**: `npm run dev`
5. **Check browser console**: Look for 404 errors on favicon files

### Wrong size or quality?

1. **Source image**: Use high-resolution source (at least 512x512px)
2. **Format**: PNG for favicons, JPEG for logo
3. **Background**: Ensure transparent or white background works well

### Still not working?

1. Check `app/layout.tsx` - favicon paths should match your files
2. Verify files are in `public/` folder (not `public/images/`)
3. Check Next.js build output for any errors

---

## Current Configuration

The favicon is configured in `app/layout.tsx` with these settings:

```typescript
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    { url: '/autohub-logo.jpeg', sizes: '512x512', type: 'image/jpeg' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '192x192', type: 'image/png' },
  ],
  shortcut: [
    { url: '/favicon.ico', sizes: 'any' },
  ],
}
```

This configuration supports:
- ✅ Standard browser favicons
- ✅ iOS home screen icons
- ✅ Android Chrome icons
- ✅ High-resolution displays
- ✅ Multiple device sizes

---

## Notes

- The favicon files are automatically served from the `public/` folder by Next.js
- No additional configuration needed in `next.config.js`
- Favicons are cached by browsers - may take time to update
- Use `.ico` format for maximum compatibility
- Use `.png` format for better quality and transparency support

