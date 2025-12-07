# Supabase Schema Setup

This directory contains SQL migrations and scripts to ensure your Supabase database has the correct schema.

## Quick Start

### 1. Run the Migration

Run the SQL migration file in your Supabase SQL Editor:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste the contents of `migrations/001_init.sql`
6. Click **Run** (or press Ctrl+Enter)

### 2. Verify Schema (Optional)

Run the schema check script to verify all tables exist:

```bash
# Set environment variables
export SUPABASE_URL=your_supabase_project_url
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Or on Windows PowerShell:
$env:SUPABASE_URL="your_supabase_project_url"
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the script
npm run ensure:supabase
```

## Environment Variables

The schema check script requires:

- **SUPABASE_URL**: Your Supabase project URL
  - Found in: Supabase Dashboard > Settings > API > Project URL
  - Or use: `NEXT_PUBLIC_SUPABASE_URL` from your `.env.local`

- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (admin key)
  - Found in: Supabase Dashboard > Settings > API > service_role key
  - ⚠️ **Keep this secret!** Never commit it to version control
  - This key has admin privileges and bypasses Row Level Security

## Manual Setup

If you prefer to set up the schema manually:

1. Open `migrations/001_init.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Run the query

## What Gets Created

The migration creates:

- **cars** table: Main car listings table with all required fields
- **reviews** table: User reviews for cars
- **favorites** table: User favorite cars
- **Indexes**: Performance indexes on key columns
- **RLS Policies**: Row Level Security policies for data access
- **Triggers**: Cascade delete handlers

## Troubleshooting

### "Table does not exist" error

Run the migration SQL manually in Supabase SQL Editor.

### "Permission denied" error

Ensure you're using the **service_role** key (not the anon key) for the schema check script.

### Schema check script fails

The script checks if tables exist. For full schema setup, always run the SQL migration manually in Supabase SQL Editor.

## Files

- `migrations/001_init.sql`: Main migration file with all table definitions
- `README.md`: This file

## Related Scripts

- `npm run ensure:supabase`: Runs the schema check script

