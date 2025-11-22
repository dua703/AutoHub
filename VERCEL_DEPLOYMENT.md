# AutoHub - Vercel Deployment Guide

Complete step-by-step guide for deploying AutoHub to Vercel with a custom domain.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Supabase project (create at [supabase.com](https://supabase.com))
- ✅ UploadThing account (sign up at [uploadthing.com](https://uploadthing.com))
- ✅ Custom domain (optional, but recommended)

---

## Step 1: Prepare Your Code

### 1.1 Verify Local Setup

```bash
# Install dependencies
npm install

# Test local build
npm run build

# Test production server locally
npm start
```

### 1.2 Create Environment File

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

**⚠️ Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.

---

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize (2-3 minutes)

### 2.2 Run Database Migration

1. Go to SQL Editor in Supabase dashboard
2. Run the following SQL:

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
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Users can insert their own cars
DROP POLICY IF EXISTS "Users can insert their own cars" ON cars;
CREATE POLICY "Users can insert their own cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cars
DROP POLICY IF EXISTS "Users can update their own cars" ON cars;
CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cars
DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;
CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE USING (auth.uid() = user_id);
```

### 2.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 3: UploadThing Setup

### 3.1 Create UploadThing Account

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up and create a new app
3. Get your credentials from the dashboard

### 3.2 Get UploadThing Credentials

1. Go to your app dashboard
2. Copy:
   - **Secret Key** → `UPLOADTHING_SECRET`
   - **App ID** → `UPLOADTHING_APP_ID`

---

## Step 4: Push to GitHub

### 4.1 Initialize Git (if not already)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 4.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Create a new repository
3. **Don't** initialize with README (if you already have one)

### 4.3 Push Code

```bash
git remote add origin https://github.com/yourusername/autohub.git
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy to Vercel

### 5.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 5.2 Configure Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

**How to add:**
1. Go to **Settings** → **Environment Variables**
2. Add each variable
3. Select **Production**, **Preview**, and **Development**
4. Click **Save**

### 5.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at `your-project.vercel.app`

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Enter your domain (e.g., `autohub.com`)
3. Follow Vercel's DNS configuration instructions

### 6.2 Configure DNS

Add these DNS records at your domain provider:

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.3 SSL Certificate

Vercel automatically provisions SSL certificates. Wait 1-24 hours for DNS propagation.

---

## Step 7: Post-Deployment Testing

### 7.1 Test Checklist

- [ ] **Homepage loads** - Visit your domain
- [ ] **Sign Up** - Create a new account
- [ ] **Sign In** - Login with credentials
- [ ] **Protected Routes** - Try accessing `/sell` without login (should redirect)
- [ ] **Post Car** - Create a new listing with images
- [ ] **Image Upload** - Verify UploadThing works
- [ ] **View Listing** - Check car detail page
- [ ] **Dashboard** - View your listings
- [ ] **Edit/Delete** - Test CRUD operations
- [ ] **Responsive** - Test on mobile, tablet, desktop
- [ ] **Search/Browse** - Test `/buy` page

### 7.2 Common Issues & Fixes

**Issue: Images not uploading**
- ✅ Check UploadThing credentials in Vercel
- ✅ Verify UploadThing app is active
- ✅ Check browser console for errors

**Issue: Authentication not working**
- ✅ Verify Supabase URL and key
- ✅ Check Supabase Auth settings
- ✅ Ensure middleware.ts is in root directory

**Issue: Database errors**
- ✅ Verify RLS policies are set
- ✅ Check Supabase logs
- ✅ Ensure all columns exist

**Issue: Build fails**
- ✅ Check TypeScript errors: `npm run build` locally
- ✅ Verify all dependencies are in package.json
- ✅ Check Vercel build logs

---

## Step 8: Production Optimizations

### 8.1 Enable Analytics (Optional)

1. Go to Vercel dashboard
2. Enable **Analytics** and **Speed Insights**

### 8.2 Set Up Monitoring

- Monitor error logs in Vercel dashboard
- Set up Supabase monitoring
- Configure alerts for critical errors

### 8.3 Performance

- Images are automatically optimized by Next.js
- Static pages are pre-rendered
- API routes use edge functions

---

## Deployment Checklist

### Pre-Deployment

- [ ] All code pushed to GitHub
- [ ] `.env.local` created (not committed)
- [ ] Supabase project created and migrated
- [ ] UploadThing account set up
- [ ] Local build succeeds: `npm run build`
- [ ] All features tested locally

### Deployment

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project imported
- [ ] Environment variables added in Vercel
- [ ] Build successful in Vercel
- [ ] Site accessible at Vercel URL

### Post-Deployment

- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] All features tested on production
- [ ] Responsive design verified
- [ ] Error monitoring set up

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Get |
|----------|-----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `UPLOADTHING_SECRET` | UploadThing secret key | UploadThing Dashboard |
| `UPLOADTHING_APP_ID` | UploadThing app ID | UploadThing Dashboard |

### Variable Naming

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-only
- Never commit secrets to Git

---

## Support & Troubleshooting

### Vercel Support

- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### Supabase Support

- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)

### UploadThing Support

- Documentation: [docs.uploadthing.com](https://docs.uploadthing.com)

### Project Support

For issues specific to AutoHub, contact: **duaariz04@gmail.com**

---

## Quick Deploy Commands

```bash
# Local development
npm run dev

# Production build test
npm run build
npm start

# Deploy to Vercel (after setup)
# Just push to GitHub - Vercel auto-deploys
git add .
git commit -m "Deploy updates"
git push origin main
```

---

## Success! 🎉

Your AutoHub marketplace is now live on Vercel!

**Next Steps:**
1. Share your site URL
2. Monitor analytics
3. Gather user feedback
4. Iterate and improve

**Remember:**
- Keep environment variables secure
- Monitor error logs regularly
- Update dependencies periodically
- Backup your Supabase database

---

© 2025 AutoHub. All rights reserved.
Design & Developed by duaariz04@gmail.com

