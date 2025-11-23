# AutoHub - Render.com Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- ✅ GitHub repository with your code
- ✅ Render.com account ([sign up here](https://render.com))
- ✅ Supabase project set up
- ✅ UploadThing account configured

### 2. Environment Variables Setup

**Before deploying, prepare these values:**

#### From Supabase Dashboard:
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### From UploadThing Dashboard:
1. Go to your app dashboard
2. Copy:
   - **Secret Key** → `UPLOADTHING_SECRET`
   - **App ID** → `UPLOADTHING_APP_ID`

### 3. Deploy to Render.com

#### Option A: Using Render Dashboard (Recommended)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub account if not already connected
   - Select your **AutoHub repository**

2. **Configure Service Settings**
   ```
   Name: autohub (or your preferred name)
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: ./
   Build Command: npm run build
   Start Command: npm start
   Plan: Starter (free) or any paid plan
   ```

3. **Add Environment Variables**
   - Scroll to **"Environment Variables"** section
   - Click **"Add Environment Variable"** for each:
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `UPLOADTHING_SECRET` | Your UploadThing secret |
   | `UPLOADTHING_APP_ID` | Your UploadThing app ID |
   
   **⚠️ Important:**
   - Use actual values, NOT placeholders
   - Do NOT use `@` symbols (that's Vercel syntax)
   - All values are case-sensitive

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will automatically:
     - Clone your repository
     - Install dependencies (`npm install`)
     - Build the project (`npm run build`)
     - Start the server (`npm start`)
   - Wait 5-10 minutes for first deployment

5. **Configure Supabase CORS**
   - Once deployed, copy your Render URL (e.g., `https://autohub.onrender.com`)
   - Go to Supabase Dashboard → **Settings → API**
   - Add your Render URL to **"Allowed Origins"**:
     ```
     https://your-app-name.onrender.com
     ```

#### Option B: Using render.yaml

1. The `render.yaml` file is already in the repository
2. In Render dashboard, when creating service:
   - Select **"Apply render.yaml"**
   - Render will read the configuration
3. Still need to manually add environment variables in dashboard

### 4. Post-Deployment Checklist

- [ ] Verify app is accessible at your Render URL
- [ ] Test authentication (sign up/sign in)
- [ ] Test car listing creation
- [ ] Test image uploads
- [ ] Verify Supabase CORS is configured
- [ ] Check Render logs for any errors

### 5. Custom Domain (Optional)

1. In Render dashboard → **Settings → Custom Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Update Supabase CORS with your custom domain

## 🔧 Troubleshooting

### Build Fails
- Check Render build logs
- Verify all environment variables are set
- Ensure `npm run build` works locally
- Check for TypeScript errors

### App Crashes on Start
- Check Render runtime logs
- Verify `npm start` works locally
- Ensure all environment variables are correct
- Check Node.js version compatibility

### Authentication Not Working
- Verify Supabase URL and keys are correct
- Check Supabase CORS settings
- Verify middleware.ts is in repository
- Check browser console for errors

### Image Uploads Failing
- Verify UploadThing credentials
- Check UploadThing app status
- Review browser console for errors
- Verify API routes are accessible

### Environment Variables Not Working
- Ensure variables are set in Render dashboard (not just in code)
- Check variable names match exactly (case-sensitive)
- Verify no `@` symbols in values
- Restart service after adding variables

## 📋 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous/public key |
| `UPLOADTHING_SECRET` | ✅ Yes | UploadThing secret key |
| `UPLOADTHING_APP_ID` | ✅ Yes | UploadThing app ID |

## 🔒 Security Notes

- ✅ Never commit secrets to Git
- ✅ Always use environment variables
- ✅ Keep Supabase service role key secret (not needed for this app)
- ✅ Regularly rotate API keys
- ✅ Use Render's environment variable encryption

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [UploadThing Documentation](https://docs.uploadthing.com)

## 🆘 Support

If you encounter issues:
1. Check Render logs in dashboard
2. Verify all environment variables are set correctly
3. Test locally with `npm run build && npm start`
4. Check Supabase and UploadThing dashboards for service status

---

**Ready to deploy?** Follow the steps above and your AutoHub marketplace will be live on Render.com! 🚀

