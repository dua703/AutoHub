# Environment Variables Setup

Quick reference for setting up environment variables for AutoHub.

## Local Development (.env.local)

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# UploadThing Configuration
UPLOADTHING_SECRET=sk_live_your_secret_here
UPLOADTHING_APP_ID=your_app_id_here
```

## Vercel Production

Add these same variables in Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add each variable
3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

## Where to Get Values

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### UploadThing
1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign in to your dashboard
3. Select your app
4. Copy:
   - **Secret Key** → `UPLOADTHING_SECRET`
   - **App ID** → `UPLOADTHING_APP_ID`

## Security Notes

- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for development and production
- ✅ Rotate keys if compromised
- ✅ Variables starting with `NEXT_PUBLIC_` are exposed to browser
- ✅ Other variables are server-only

## Verification

After setting up, verify:

```bash
# Check if variables are loaded (local)
npm run dev
# Should start without errors

# Test build
npm run build
# Should complete successfully
```

