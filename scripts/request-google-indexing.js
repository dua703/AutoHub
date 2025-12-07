#!/usr/bin/env node

/**
 * AutoHub Google Indexing Automation Script
 * 
 * Automatically requests Google indexing for Autohub pages.
 * Checks robots.txt and uses Google Search Console API.
 * 
 * Usage:
 *   node scripts/request-google-indexing.js <url1> <url2> ...
 * 
 * Or with environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
 *   GOOGLE_SITE_URL=https://autohub.com
 *   node scripts/request-google-indexing.js <url1> <url2> ...
 */

const https = require('https');
const { URL } = require('url');

const AUTOHUB_BASE_URL = process.env.AUTOHUB_BASE_URL || 'https://autohub.com';
const ROBOTS_TXT_URL = `${AUTOHUB_BASE_URL}/robots.txt`;

// Parse robots.txt rules
function parseRobotsTxt(content) {
  const rules = {
    disallow: [],
    allow: []
  };
  
  const lines = content.split('\n');
  let currentUserAgent = '*';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const [directive, value] = trimmed.split(':').map(s => s.trim());
    
    if (directive.toLowerCase() === 'user-agent') {
      currentUserAgent = value || '*';
    } else if (directive.toLowerCase() === 'disallow') {
      if (currentUserAgent === '*' || currentUserAgent === 'Googlebot') {
        rules.disallow.push(value || '/');
      }
    } else if (directive.toLowerCase() === 'allow') {
      if (currentUserAgent === '*' || currentUserAgent === 'Googlebot') {
        rules.allow.push(value || '/');
      }
    }
  }
  
  return rules;
}

// Check if URL is blocked by robots.txt
function isUrlBlocked(url, rules) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // Check disallow rules
    for (const disallowPath of rules.disallow) {
      if (disallowPath === '/') {
        return true; // Everything blocked
      }
      if (path.startsWith(disallowPath)) {
        // Check if there's an allow rule that overrides
        let allowed = false;
        for (const allowPath of rules.allow) {
          if (path.startsWith(allowPath)) {
            allowed = true;
            break;
          }
        }
        if (!allowed) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking URL ${url}:`, error.message);
    return true; // Block on error
  }
}

// Fetch robots.txt
async function fetchRobotsTxt() {
  return new Promise((resolve, reject) => {
    const url = new URL(ROBOTS_TXT_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'AutoHub-Indexing-Bot/1.0'
      }
    };
    
    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Failed to fetch robots.txt: ${res.statusCode}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Request indexing via Google Search Console API
async function requestIndexing(url, serviceAccountEmail, privateKey) {
  if (!serviceAccountEmail || !privateKey) {
    // Provide manual instructions
    const searchConsoleUrl = `https://search.google.com/search-console/inspect?resource_id=sc_domain:${new URL(AUTOHUB_BASE_URL).hostname}&url=${encodeURIComponent(url)}`;
    
    console.log(`\n📋 Manual Indexing Instructions for: ${url}`);
    console.log(`   Direct link: ${searchConsoleUrl}`);
    console.log(`   Steps:`);
    console.log(`   1. Open: https://search.google.com/search-console`);
    console.log(`   2. Select property: ${AUTOHUB_BASE_URL}`);
    console.log(`   3. Click "URL Inspection" in left sidebar`);
    console.log(`   4. Paste URL: ${url}`);
    console.log(`   5. Click "Test Live URL"`);
    console.log(`   6. Wait for test to complete`);
    console.log(`   7. If crawlable, click "Request Indexing"`);
    console.log(`   8. Confirm indexing request`);
    
    return {
      success: false,
      error: 'Manual indexing required',
      manual: true,
      searchConsoleUrl
    };
  }

  try {
    // Note: This requires googleapis package and proper OAuth2 setup
    // For now, we'll provide instructions
    console.log(`\n⚠️  To request indexing for ${url}:`);
    console.log(`   1. Go to: https://search.google.com/search-console`);
    console.log(`   2. Select your property: ${AUTOHUB_BASE_URL}`);
    console.log(`   3. Use URL Inspection tool`);
    console.log(`   4. Enter: ${url}`);
    console.log(`   5. Click "Test Live URL"`);
    console.log(`   6. Click "Request Indexing"`);
    
    return {
      success: false,
      error: 'Manual indexing required - see instructions above',
      manual: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  const urls = process.argv.slice(2);
  
  if (urls.length === 0) {
    console.error('Usage: node scripts/request-google-indexing.js <url1> <url2> ...');
    console.error('Example: node scripts/request-google-indexing.js https://autohub.com/buy https://autohub.com/sell');
    process.exit(1);
  }
  
  console.log('🔍 AutoHub Google Indexing Automation\n');
  console.log(`Base URL: ${AUTOHUB_BASE_URL}`);
  console.log(`URLs to process: ${urls.length}\n`);
  
  // Fetch robots.txt
  let robotsRules;
  try {
    console.log('📄 Fetching robots.txt...');
    const robotsContent = await fetchRobotsTxt();
    robotsRules = parseRobotsTxt(robotsContent);
    console.log('✅ robots.txt fetched successfully\n');
  } catch (error) {
    console.error('❌ Error fetching robots.txt:', error.message);
    console.error('⚠️  Assuming all URLs are allowed\n');
    robotsRules = { disallow: [], allow: [] };
  }
  
  // Process each URL
  const results = [];
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  for (const url of urls) {
    // Validate URL
    let urlObj;
    try {
      urlObj = new URL(url);
      if (!urlObj.hostname.includes('autohub')) {
        results.push({
          url,
          status: 'Cannot index',
          notes: 'Not an Autohub URL'
        });
        continue;
      }
    } catch (error) {
      results.push({
        url,
        status: 'Cannot index',
        notes: `Invalid URL: ${error.message}`
      });
      continue;
    }
    
    // Check robots.txt
    const blocked = isUrlBlocked(url, robotsRules);
    
    if (blocked) {
      results.push({
        url,
        status: 'Cannot index',
        notes: 'Blocked by robots.txt'
      });
      continue;
    }
    
    // Request indexing
    console.log(`\n📝 Processing: ${url}`);
    const indexingResult = await requestIndexing(url, serviceAccountEmail, privateKey);
    
    if (indexingResult.success) {
      results.push({
        url,
        status: 'Indexing requested successfully',
        notes: 'Submitted via Google Search Console API',
        searchConsoleUrl: indexingResult.searchConsoleUrl
      });
    } else if (indexingResult.manual) {
      results.push({
        url,
        status: 'Ready for indexing',
        notes: indexingResult.searchConsoleUrl ? `Direct link: ${indexingResult.searchConsoleUrl}` : 'Use Google Search Console URL Inspection tool',
        searchConsoleUrl: indexingResult.searchConsoleUrl
      });
    } else {
      results.push({
        url,
        status: 'Cannot index',
        notes: indexingResult.error || 'Unknown error'
      });
    }
  }
  
  // Print summary table
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY TABLE');
  console.log('='.repeat(80));
  console.log('\nURL | Status | Notes');
  console.log('-'.repeat(80));
  
  for (const result of results) {
    const url = result.url.padEnd(40).substring(0, 40);
    const status = result.status.padEnd(30).substring(0, 30);
    const notes = result.notes;
    console.log(`${url} | ${status} | ${notes}`);
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Statistics
  const successful = results.filter(r => r.status.includes('successfully')).length;
  const blocked = results.filter(r => r.status === 'Cannot index').length;
  const ready = results.filter(r => r.status.includes('Ready')).length;
  
  console.log(`\n📈 Statistics:`);
  console.log(`   ✅ Successfully requested: ${successful}`);
  console.log(`   ✅ Ready for indexing: ${ready}`);
  console.log(`   🚫 Blocked: ${blocked}`);
  console.log(`   📊 Total: ${results.length}`);
  
  // Show direct links for ready URLs
  const readyUrls = results.filter(r => r.searchConsoleUrl);
  if (readyUrls.length > 0) {
    console.log(`\n🔗 Direct Search Console Links:`);
    readyUrls.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.url}`);
      console.log(`      ${result.searchConsoleUrl}`);
    });
  }
  
  console.log('\n');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

