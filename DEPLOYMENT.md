# AutoHub Deployment Guide

Complete guide for deploying AutoHub to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Supabase project
- UploadThing account

## Step 1: Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:

```sql
-- Add all required columns to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS mileage INTEGER,
ADD COLUMN IF NOT EXISTS transmission TEXT,
ADD COLUMN IF NOT EXISTS engine_capacity TEXT,
ADD COLUMN IF NOT EXISTS fuel_type TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS registration_city TEXT,
ADD COLUMN IF NOT EXISTS engine_type TEXT,
ADD COLUMN IF NOT EXISTS body_type TEXT,
ADD COLUMN IF NOT EXISTS assembly TEXT;

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Users can insert their own cars
CREATE POLICY IF NOT EXISTS "Users can insert their own cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cars
CREATE POLICY IF NOT EXISTS "Users can update their own cars" ON cars
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cars
CREATE POLICY IF NOT EXISTS "Users can delete their own cars" ON cars
  FOR DELETE USING (auth.uid() = user_id);
```

3. Get your Supabase URL and anon key from Settings > API

## Step 2: UploadThing Setup

1. Create account at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Get your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`

## Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

5. Click "Deploy"

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Test sign up/sign in
3. Test posting a car listing
4. Verify images upload correctly
5. Check car detail pages

## Troubleshooting

### Images not uploading
- Verify UploadThing credentials are correct
- Check UploadThing dashboard for errors

### Database errors
- Verify Supabase RLS policies are set correctly
- Check Supabase logs for errors

### Authentication issues
- Verify Supabase URL and anon key
- Check Supabase Auth settings

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] RLS policies configured
- [ ] UploadThing configured
- [ ] Test all features
- [ ] Verify responsive design
- [ ] Check error handling

## Support

For issues or questions, contact: duaariz04@gmail.com

