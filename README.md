# AutoHub - Car Marketplace

A production-ready car marketplace website built with Next.js 14, Supabase, and UploadThing. Similar to PakWheels, featuring comprehensive car listings, user authentication, and image uploads.

## 🚀 Features

- ✅ **Post Car Listings** - Comprehensive form with all car specifications
- ✅ **User Dashboard** - View, edit, and delete your listings
- ✅ **Car Detail Pages** - Full specifications and image galleries
- ✅ **Authentication** - Sign up, sign in with Supabase Auth
- ✅ **Image Upload** - Multiple images via UploadThing
- ✅ **Protected Routes** - Login required for posting
- ✅ **Responsive Design** - Mobile-first, fully responsive
- ✅ **TypeScript** - Fully typed codebase
- ✅ **Production Ready** - Ready for deployment on Render.com or Vercel

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Upload**: UploadThing
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- UploadThing account
- Render.com account (for deployment) or Vercel

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/autohub.git
cd autohub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### 4. Database Setup

Run the SQL migration in your Supabase SQL Editor (see `supabase-add-car-fields.sql` or `VERCEL_DEPLOYMENT.md`).

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
  sell/              # Post car listing page
  dashboard/         # User dashboard
  cars/[id]/         # Car detail page
  login/             # Sign in page
  signup/            # Sign up page
  buy/               # Browse cars page

components/
  SellCarForm.tsx    # Comprehensive car listing form
  CarDetailsClient.tsx # Car detail display
  Navbar.tsx         # Navigation bar
  Footer.tsx         # Footer component
  ...

lib/
  supabase.ts        # Supabase client and types
  uploadthing.ts     # UploadThing configuration
  ...

middleware.ts        # Supabase SSR middleware
next.config.js       # Next.js configuration
render.yaml          # Render.com deployment config
```

## 🚢 Deployment

### Deploy to Render.com

#### Prerequisites
- GitHub repository with your code
- Render.com account (sign up at [render.com](https://render.com))

#### Step-by-Step Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the AutoHub repository

3. **Configure the Service**
   - **Name**: `autohub` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose Starter (free) or any paid plan

4. **Set Environment Variables**
   
   In the Render dashboard, go to **Environment** section and add these variables:
   
   | Variable | Description | Where to Find |
   |----------|-------------|---------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API → anon public key |
   | `UPLOADTHING_SECRET` | UploadThing secret key | UploadThing Dashboard → Your App → Secret Key |
   | `UPLOADTHING_APP_ID` | UploadThing app ID | UploadThing Dashboard → Your App → App ID |
   
   **Important**: 
   - Do NOT use `@` symbols in environment variable values
   - Add the actual values directly (not placeholders)
   - All variables are case-sensitive

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the build to complete (usually 5-10 minutes)
   - Your app will be available at `https://your-app-name.onrender.com`

6. **Configure Supabase CORS**
   - Go to Supabase Dashboard → Settings → API
   - Add your Render domain to allowed origins:
     ```
     https://your-app-name.onrender.com
     ```

#### Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:
1. The `render.yaml` file is already included in the repository
2. In Render dashboard, select "Apply render.yaml" when creating the service
3. Still need to manually add environment variables in the dashboard

### Deploy to Vercel (Alternative)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Checklist

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a complete checklist.

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Environment Variables

### Required for Render.com Deployment

These environment variables **must** be set in the Render dashboard before deployment:

| Variable | Description | Required | Where to Find |
|----------|-------------|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes | Supabase Dashboard → Settings → API → anon public key |
| `UPLOADTHING_SECRET` | UploadThing secret key | Yes | UploadThing Dashboard → Your App → Secret Key |
| `UPLOADTHING_APP_ID` | UploadThing app ID | Yes | UploadThing Dashboard → Your App → App ID |

**Important Notes:**
- ⚠️ **Never commit secrets to Git** - Always use environment variables
- ⚠️ **No `@` symbols** - Render doesn't use Vercel's `@variable` syntax
- ⚠️ **Add actual values** - Not placeholders like `@supabase_url`
- ✅ **Case-sensitive** - Variable names must match exactly
- ✅ **Set before first deploy** - Add all variables in Render dashboard before deploying

## 🗄️ Database Schema

The `cars` table includes:
- Basic info: title, make, model, year
- Specifications: mileage, transmission, engine_capacity, fuel_type, etc.
- Location: registration_city
- Images: array of image URLs
- User association: user_id

See SQL migration files for complete schema.

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Protected routes require authentication
- Environment variables never exposed to client
- Secure image uploads via UploadThing

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons and inputs
- Responsive grids and layouts

## 🐛 Troubleshooting

### Build Errors
- Run `npm run build` locally to catch errors
- Check TypeScript and ESLint errors
- Verify all dependencies are installed

### Authentication Issues
- Verify Supabase credentials
- Check middleware.ts exists
- Ensure cookies are enabled

### Image Upload Issues
- Verify UploadThing credentials
- Check UploadThing app status
- Review browser console for errors

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [UploadThing Docs](https://docs.uploadthing.com)

## 🤝 Contributing

This is a private project. For issues or questions, contact: **duaariz04@gmail.com**

## 📄 License

© 2025 AutoHub. All rights reserved.

## 👨‍💻 Developer

**Design & Developed by:** duaariz04@gmail.com

---

Made with ❤️ using Next.js, Supabase, and UploadThing
