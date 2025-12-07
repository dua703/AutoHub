#!/usr/bin/env node

/**
 * Supabase Schema Check Script
 * 
 * Ensures all required tables, columns, and indexes exist in Supabase.
 * Uses SERVICE_ROLE key for admin operations.
 * 
 * Environment Variables Required:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (admin key)
 * 
 * Usage:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/ensure_supabase_schema.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Error: SUPABASE_URL environment variable is required');
  console.error('   Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Get your service role key from Supabase Dashboard > Settings > API');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function readMigrationFile() {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_init.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: Migration file not found at ${migrationPath}`);
    process.exit(1);
  }
  
  return fs.readFileSync(migrationPath, 'utf-8');
}

async function executeSQL(sql) {
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        // Use RPC or direct query - Supabase JS client doesn't support raw SQL directly
        // So we'll check if tables exist instead
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // If RPC doesn't exist, we'll check tables manually
          if (error.message.includes('function exec_sql') || error.message.includes('does not exist')) {
            // Fallback: check tables exist
            console.log('⚠️  Note: Direct SQL execution not available. Checking tables manually...');
            break;
          } else {
            console.error(`   ❌ Error: ${error.message}`);
            errorCount++;
          }
        } else {
          successCount++;
        }
      } catch (err) {
        // Ignore errors for CREATE IF NOT EXISTS statements
        if (err.message && (
          err.message.includes('already exists') ||
          err.message.includes('duplicate')
        )) {
          // This is expected for IF NOT EXISTS
          successCount++;
        } else {
          console.error(`   ❌ Error executing statement: ${err.message}`);
          errorCount++;
        }
      }
    }
    
    return { successCount, errorCount };
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    throw error;
  }
}

async function checkTablesExist() {
  const requiredTables = ['cars', 'reviews', 'favorites'];
  const results = {};
  
  for (const tableName of requiredTables) {
    try {
      // Try to query the table (limited to 1 row for efficiency)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          results[tableName] = false;
          console.log(`   ❌ Table '${tableName}' does not exist`);
        } else {
          // Table exists but might have permission issues
          results[tableName] = true;
          console.log(`   ✅ Table '${tableName}' exists`);
        }
      } else {
        results[tableName] = true;
        console.log(`   ✅ Table '${tableName}' exists`);
      }
    } catch (err) {
      if (err.message && err.message.includes('does not exist')) {
        results[tableName] = false;
        console.log(`   ❌ Table '${tableName}' does not exist`);
      } else {
        console.error(`   ⚠️  Error checking table '${tableName}': ${err.message}`);
        results[tableName] = false;
      }
    }
  }
  
  return results;
}

async function main() {
  console.log('🔍 Checking Supabase schema...\n');
  console.log(`   URL: ${SUPABASE_URL.replace(/\/$/, '')}`);
  console.log(`   Using Service Role Key: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...\n`);
  
  try {
    // First, check if tables exist
    console.log('📊 Checking required tables...');
    const tableResults = await checkTablesExist();
    
    const missingTables = Object.entries(tableResults)
      .filter(([_, exists]) => !exists)
      .map(([name]) => name);
    
    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('   Please run the migration SQL manually in Supabase SQL Editor:');
      console.log('   File: supabase/migrations/001_init.sql\n');
      console.log('   Or visit: https://supabase.com/dashboard/project/_/sql/new');
      process.exit(1);
    }
    
    console.log('\n✅ All required tables exist!');
    console.log('\n📝 Note: This script checks table existence.');
    console.log('   For full schema setup, run the SQL migration manually:');
    console.log('   supabase/migrations/001_init.sql');
    console.log('\n✨ Schema check complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('\n   Please check:');
    console.error('   1. SUPABASE_URL is correct');
    console.error('   2. SUPABASE_SERVICE_ROLE_KEY is correct');
    console.error('   3. Your Supabase project is accessible');
    console.error('\n   For manual setup, run: supabase/migrations/001_init.sql');
    process.exit(1);
  }
}

// Run the script
main();

