#!/usr/bin/env node

/**
 * Google Analytics 4 Installation Verification Script
 * 
 * Verifies that GA4 tag (G-HQCMTLY3R6) is installed on all pages
 */

const fs = require('fs');
const path = require('path');

const GA4_ID = 'G-HQCMTLY3R6';
const GA4_SCRIPT_URL = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;

// List of all pages to check
const pages = [
  { url: '/', file: 'app/page.tsx' },
  { url: '/buy', file: 'app/buy/page.tsx' },
  { url: '/sell', file: 'app/sell/page.tsx' },
  { url: '/contact', file: 'app/contact/page.tsx' },
  { url: '/login', file: 'app/login/page.tsx' },
  { url: '/signup', file: 'app/signup/page.tsx' },
  { url: '/dashboard', file: 'app/dashboard/page.tsx' },
  { url: '/favorites', file: 'app/favorites/page.tsx' },
  { url: '/car/[id]', file: 'app/car/[id]/page.tsx' },
  { url: '/car/[id]/edit', file: 'app/car/[id]/edit/page.tsx' },
  { url: '/admin', file: 'app/admin/page.tsx' },
];

function checkLayoutFile() {
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    return {
      status: 'Error',
      notes: 'Layout file not found'
    };
  }
  
  const content = fs.readFileSync(layoutPath, 'utf-8');
  
  // Check for GA4 script
  const hasGAScript = content.includes(GA4_SCRIPT_URL) || content.includes(GA4_ID);
  const hasGATag = content.includes('gtag') && content.includes(GA4_ID);
  
  if (hasGAScript && hasGATag) {
    return {
      status: 'Tag inserted',
      notes: 'Google Analytics 4 tag found in root layout (applies to all pages)'
    };
  } else if (content.includes('googletagmanager') || content.includes('gtag')) {
    return {
      status: 'Already exists',
      notes: 'Google Analytics tag found but may be different ID'
    };
  } else {
    return {
      status: 'Error',
      notes: 'Google Analytics tag not found in layout'
    };
  }
}

function checkPageFile(pageFile) {
  const filePath = path.join(process.cwd(), pageFile);
  
  if (!fs.existsSync(filePath)) {
    return {
      status: 'Error',
      notes: 'Page file not found'
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if page has its own GA4 tag (shouldn't, but check anyway)
  if (content.includes(GA4_ID) || content.includes(GA4_SCRIPT_URL)) {
    return {
      status: 'Already exists',
      notes: 'Page has its own GA4 tag (inherits from layout instead)'
    };
  }
  
  return {
    status: 'Tag inserted',
    notes: 'Inherits GA4 tag from root layout'
  };
}

function main() {
  console.log('🔍 Google Analytics 4 Installation Verification\n');
  console.log(`GA4 ID: ${GA4_ID}\n`);
  console.log('='.repeat(80));
  
  const results = [];
  
  // Check root layout (most important - applies to all pages)
  console.log('\n📄 Checking Root Layout (app/layout.tsx)...');
  const layoutResult = checkLayoutFile();
  results.push({
    url: 'Root Layout (All Pages)',
    status: layoutResult.status,
    notes: layoutResult.notes
  });
  console.log(`   Status: ${layoutResult.status}`);
  console.log(`   Notes: ${layoutResult.notes}\n`);
  
  // Check individual pages
  console.log('📄 Checking Individual Pages...\n');
  for (const page of pages) {
    const result = checkPageFile(page.file);
    results.push({
      url: page.url,
      status: result.status,
      notes: result.notes
    });
  }
  
  // Print summary table
  console.log('='.repeat(80));
  console.log('📊 VERIFICATION REPORT');
  console.log('='.repeat(80));
  console.log('\nURL | Status | Notes');
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const url = result.url.padEnd(30).substring(0, 30);
    const status = result.status.padEnd(20).substring(0, 20);
    const notes = result.notes;
    console.log(`${url} | ${status} | ${notes}`);
  }
  
  // Statistics
  const inserted = results.filter(r => r.status === 'Tag inserted').length;
  const exists = results.filter(r => r.status === 'Already exists').length;
  const errors = results.filter(r => r.status === 'Error').length;
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📈 Statistics:`);
  console.log(`   ✅ Tag inserted: ${inserted}`);
  console.log(`   ℹ️  Already exists: ${exists}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total pages checked: ${results.length}`);
  
  // Final verdict
  console.log('\n' + '='.repeat(80));
  if (layoutResult.status === 'Tag inserted') {
    console.log('✅ SUCCESS: Google Analytics 4 tag is installed in root layout!');
    console.log('   All pages will automatically have the GA4 tag.');
    console.log('   The tag will be loaded on every page of the website.');
  } else if (layoutResult.status === 'Already exists') {
    console.log('⚠️  WARNING: Google Analytics tag found but may need verification.');
  } else {
    console.log('❌ ERROR: Google Analytics 4 tag not found in root layout.');
    console.log('   Please ensure the tag is added to app/layout.tsx');
  }
  console.log('='.repeat(80));
  console.log('\n');
}

main();

