/**
 * Favicon Generator Script
 * 
 * This script helps generate favicon files from your logo.
 * 
 * Prerequisites:
 * - Install sharp: npm install --save-dev sharp
 * - Place your logo file as: public/autohub-logo-source.jpeg
 * 
 * Usage:
 * node scripts/generate-favicon.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Error: sharp is not installed.');
  console.log('\n📦 Please install sharp first:');
  console.log('   npm install --save-dev sharp\n');
  process.exit(1);
}

const publicDir = path.join(process.cwd(), 'public');
const sourceLogo = path.join(publicDir, 'autohub-logo-source.jpeg');
const outputDir = publicDir;

// Favicon sizes to generate
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 192, name: 'apple-touch-icon.png' },
  { size: 512, name: 'favicon-512x512.png' },
];

async function generateFavicons() {
  try {
    // Check if source logo exists
    if (!fs.existsSync(sourceLogo)) {
      console.error(`❌ Source logo not found: ${sourceLogo}`);
      console.log('\n📝 Please place your logo file at:');
      console.log(`   ${sourceLogo}\n`);
      process.exit(1);
    }

    console.log('🎨 Generating favicon files...\n');

    // Generate all favicon sizes
    for (const { size, name } of faviconSizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (16x16 and 32x32 combined)
    const favicon16 = await sharp(sourceLogo)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    const favicon32 = await sharp(sourceLogo)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    // For .ico, we'll use the 32x32 as favicon.ico
    await sharp(favicon32)
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✅ Generated: favicon.ico\n');

    // Copy source as main logo (optimized)
    await sharp(sourceLogo)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .jpeg({ quality: 90 })
      .toFile(path.join(outputDir, 'autohub-logo.jpeg'));

    console.log('✅ Generated: autohub-logo.jpeg (optimized)\n');
    console.log('🎉 All favicon files generated successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. The favicon files are now in the public/ folder');
    console.log('   2. The code is already configured to use them');
    console.log('   3. Test by running: npm run dev\n');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();

