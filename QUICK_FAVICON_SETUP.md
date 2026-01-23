# Quick Favicon Setup - 3 Steps

## Step 1: Place Your Logo

Copy your logo file to the `public` folder and rename it:
- **From**: `WhatsApp Image 2025-12-12 at 8.06.44 AM.jpeg`
- **To**: `public/autohub-logo-source.jpeg`

## Step 2: Install & Run Script

```bash
# Install the image processing library
npm install --save-dev sharp

# Generate all favicon files
npm run generate:favicon
```

This will create:
- ✅ `favicon.ico` - Main favicon
- ✅ `favicon-16x16.png` - Small favicon
- ✅ `favicon-32x32.png` - Standard favicon  
- ✅ `favicon-96x96.png` - Large favicon
- ✅ `apple-touch-icon.png` - iOS icon
- ✅ `autohub-logo.jpeg` - Optimized logo for navbar

## Step 3: Test

```bash
npm run dev
```

Open your browser and check:
- ✅ Favicon appears in browser tab
- ✅ Logo appears in navbar

**That's it!** The code is already configured to use these files.

---

## Alternative: Manual Setup (No Script)

If you prefer not to use the script:

1. **Use an online tool**: https://realfavicongenerator.net/
   - Upload your logo
   - Download the generated package
   - Extract files to `public/` folder

2. **Or use**: https://favicon.io/
   - Upload your logo
   - Download and extract to `public/`

3. **Make sure these files exist in `public/`**:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon-96x96.png`
   - `apple-touch-icon.png`
   - `autohub-logo.jpeg` (your main logo)

---

## Troubleshooting

**Favicon not showing?**
1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server
3. Check files are in `public/` folder (not a subfolder)

**Need help?** See `FAVICON_SETUP_GUIDE.md` for detailed instructions.

