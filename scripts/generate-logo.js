// Simple script to generate logo PNG from SVG
// This is a placeholder - in production, use a proper image conversion library
// For now, we'll create a simple colored PNG

const fs = require('fs');
const path = require('path');

// Create a simple 512x512 PNG placeholder
// In a real scenario, you'd use sharp, canvas, or similar library
// For now, we'll note that the SVG exists and can be converted manually

console.log('Logo SVG created at public/logo-car-fire.svg');
console.log('To generate PNG, use an image converter or online tool to convert the SVG to 512x512 PNG');
console.log('Or install sharp: npm install sharp');
console.log('Then convert: sharp -i public/logo-car-fire.svg -o public/logo-car-fire-512.png -s 512x512');

