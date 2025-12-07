# AutoHub Deployment Guide - Vercel

## 🚀 Complete Deployment Checklist

### Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Database schema run in Supabase
- [ ] Admin user created
- [ ] Environment variables documented
- [ ] Tested locally (`npm run build` succeeds)
- [ ] No TypeScript errors
- [ ] No console errors in browser

---

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your AutoHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### 3. Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPLOADTHING_SECRET=your_uploadthing_secret
```

#### Where to Find:

**Supabase:**
1. Go to your Supabase project
2. Settings → API
3. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

**UploadThing:**
1. Go to [uploadthing.com](https://uploadthing.com)
2. Dashboard → Your App
3. Copy `Secret Key` → `UPLOADTHING_SECRET`

### 4. Supabase Configuration

#### Enable CORS for Vercel Domain

In Supabase Dashboard → Settings → API:

Add your Vercel domain to allowed origins:
```
https://your-project.vercel.app
https://your-custom-domain.com
```

#### Database Setup

1. Run `supabase-complete-setup.sql` in Supabase SQL Editor
2. Verify all tables created:
   - `cars`
   - `favorites`
   - `reviews`
   - `contact_messages`
   - `user_profiles`

3. Create admin user:
   ```sql
   -- Find your user ID
   SELECT id, email FROM auth.users;
   
   -- Make yourself admin
   UPDATE user_profiles 
   SET is_admin = true 
   WHERE id = 'YOUR_USER_ID';
   ```

#### Row Level Security (RLS)

Verify RLS is enabled:
- All tables should have RLS enabled
- Policies should be created (included in SQL script)

### 5. Deploy to Vercel

1. Click **"Deploy"** in Vercel
2. Wait for build to complete
3. Check build logs for errors
4. Visit your deployment URL

### 6. Post-Deployment

#### Test Your Deployment

- [ ] Homepage loads
- [ ] Can sign up / sign in
- [ ] Can browse cars (`/buy`)
- [ ] Can post a car (`/sell`)
- [ ] Images upload correctly
- [ ] Favorites work
- [ ] Contact seller works
- [ ] Reviews work
- [ ] Admin panel accessible (if admin)

#### Custom Domain (Optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Supabase CORS with new domain

---

## 🔧 Vercel-Specific Optimizations

### Build Settings

Vercel auto-detects Next.js, but verify:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables

- Add variables for **Production**, **Preview**, and **Development**
- Use same values for all environments (or different for testing)

### Performance

Vercel automatically:
- ✅ Optimizes images
- ✅ Enables compression
- ✅ Uses edge functions
- ✅ CDN caching

---

## 🐛 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Check all env vars are set in Vercel
- Ensure no typos in variable names

**Error: TypeScript errors**
- Run `npm run build` locally first
- Fix all TypeScript errors before deploying

**Error: Module not found**
- Check `package.json` has all dependencies
- Run `npm install` locally to verify

### Runtime Errors

**Error: Supabase connection failed**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check Supabase project is active
- Verify CORS settings

**Error: UploadThing not working**
- Check `UPLOADTHING_SECRET` is set
- Verify endpoint configuration
- Check UploadThing dashboard for errors

**Error: RLS policies blocking**
- Verify RLS policies in Supabase
- Check user authentication
- Review policy conditions

### Database Issues

**Tables not found**
- Run `supabase-complete-setup.sql` again
- Check Supabase SQL editor for errors

**Can't insert data**
- Check RLS policies allow INSERT
- Verify user is authenticated
- Check user_id matches

---

## 📊 Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. Supabase Dashboard → Logs
2. Monitor:
   - API requests
   - Database queries
   - Auth events

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance

---

## 🔒 Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is secret (never expose)
- [ ] `UPLOADTHING_SECRET` is secret
- [ ] RLS policies enabled on all tables
- [ ] Admin routes protected
- [ ] User data isolated by RLS
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not in code

---

## 🚀 Production Optimizations

### Already Implemented

- ✅ Image optimization (Next.js Image)
- ✅ Code splitting (automatic)
- ✅ Compression enabled
- ✅ SWC minification
- ✅ React Strict Mode

### Additional Optimizations

1. **Enable Vercel Analytics**
   - Dashboard → Analytics → Enable

2. **Set up Monitoring**
   - Add error tracking service
   - Monitor API usage

3. **Database Indexing**
   - Already included in SQL script
   - Monitor slow queries in Supabase

4. **Caching Strategy**
   - Vercel handles static assets
   - Consider ISR for car listings

---

## 📝 Post-Deployment Checklist

- [ ] Test all features
- [ ] Verify images load
- [ ] Check mobile responsiveness
- [ ] Test authentication flow
- [ ] Verify admin access
- [ ] Check error handling
- [ ] Monitor performance
- [ ] Set up custom domain (optional)
- [ ] Configure analytics
- [ ] Set up backups (Supabase)

---

## 🎉 You're Live!

Your AutoHub marketplace is now deployed and ready for users!

**Next Steps:**
1. Share your deployment URL
2. Monitor usage and errors
3. Gather user feedback
4. Iterate and improve

---

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Review browser console
4. Check network tab for API errors








