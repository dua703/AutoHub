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
- ✅ **Production Ready** - Optimized for Vercel deployment

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
- Vercel account (for deployment)

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
vercel.json          # Vercel deployment config
```

## 🚢 Deployment

### Deploy to Vercel

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

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `UPLOADTHING_SECRET` | UploadThing secret key | Yes |
| `UPLOADTHING_APP_ID` | UploadThing app ID | Yes |

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
