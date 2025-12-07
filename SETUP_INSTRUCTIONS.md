# AutoHub Complete Setup Instructions

## 🚀 Quick Start

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```sql
-- Run: supabase-complete-setup.sql
```

This creates:
- ✅ Enhanced cars table with categories, mileage, fuel_type, etc.
- ✅ Favorites table
- ✅ Reviews table
- ✅ Contact messages table
- ✅ User profiles table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Triggers for auto-updates

### 2. Make Yourself Admin

After creating your account, run this SQL to make yourself admin:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
UPDATE user_profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID';
```

Or find your user ID:
```sql
SELECT id, email FROM auth.users;
```

### 3. Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPLOADTHING_SECRET=your_uploadthing_secret
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## 📋 Features Implemented

### ✅ Core Features
- [x] Car listings with search, filters, sorting
- [x] Categories and tags
- [x] Multiple images per car with gallery
- [x] Favorites/wishlist system
- [x] Contact seller feature
- [x] Enhanced car details page
- [x] Ratings and reviews system
- [x] Admin panel
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Responsive design

### 📁 New Files Created

**Pages:**
- `app/favorites/page.tsx` - Favorites/wishlist page
- `app/admin/page.tsx` - Admin panel

**Components:**
- `components/FavoriteButton.tsx` - Add/remove favorites
- `components/ContactSellerModal.tsx` - Contact seller form
- `components/ReviewSection.tsx` - Ratings and reviews
- `components/CarDetailsClient.tsx` - Enhanced car details
- `components/ui/toast.tsx` - Toast notification system

**Database:**
- `supabase-complete-setup.sql` - Complete database schema

## 🎯 Usage Guide

### For Users

1. **Browse Cars** (`/buy`)
   - Search by name, description, or category
   - Filter by make, price, year
   - Sort by newest, price, name
   - Click categories to filter

2. **View Car Details** (`/car/[id]`)
   - See all images in gallery
   - Read description and details
   - Add to favorites
   - Contact seller
   - View and leave reviews

3. **Favorites** (`/favorites`)
   - View all saved cars
   - Access from navbar

4. **Post a Car** (`/sell`)
   - Fill out form with name, price, description
   - Upload multiple images
   - Add category and details

5. **Dashboard** (`/dashboard`)
   - Manage your listings
   - Edit or delete your cars

### For Admins

1. **Admin Panel** (`/admin`)
   - View all cars
   - View all messages
   - Delete any car
   - See statistics

## 🔧 Customization

### Add Categories

Categories are automatically extracted from car listings. To add predefined categories, update the car form.

### Styling

All components use Tailwind CSS. Customize colors in `tailwind.config.ts`.

### Email Notifications

To add email notifications for contact messages, set up Supabase Edge Functions or use a service like Resend.

## 🚢 Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

The app is production-ready with:
- ✅ Error boundaries
- ✅ Loading states
- ✅ Toast notifications
- ✅ Responsive design
- ✅ TypeScript types
- ✅ Security (RLS)

## 📝 Notes

- All database operations use Row Level Security
- Users can only edit/delete their own cars
- Admins have full access
- Favorites are user-specific
- Reviews are public but editable by author
- Contact messages are private to seller

## 🐛 Troubleshooting

**Issue: Can't see admin panel**
- Make sure you've set `is_admin = true` in user_profiles

**Issue: Favorites not working**
- Check RLS policies are enabled
- Verify user is logged in

**Issue: Images not uploading**
- Check UploadThing secret in env
- Verify endpoint configuration

**Issue: Reviews not showing**
- Check RLS policies on reviews table
- Verify user_profiles join is working

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [UploadThing Docs](https://docs.uploadthing.com)








