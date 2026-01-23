# Logo Setup Guide for AutoHub

This guide explains how to manually add a logo to your AutoHub website when opened in Cursor.

## 📍 Where to Add the Logo

The logo should be added to the **Navbar component**, which is located at:
```
components/Navbar.tsx
```

## 🎨 Steps to Add Your Logo

### Step 1: Prepare Your Logo Image

1. Create or obtain your logo image file (recommended formats: PNG, SVG, or JPEG)
2. Recommended sizes:
   - **Desktop**: 200px width × 60px height (or proportional)
   - **Mobile**: 150px width × 45px height (or proportional)
3. Save your logo file in the `public` folder:
   ```
   public/logo.png
   ```
   Or use an existing path like:
   ```
   public/autohub-logo.jpeg
   ```

### Step 2: Locate the Navbar Component

1. Open `components/Navbar.tsx` in Cursor
2. Find the `<header>` or `<nav>` section (usually near the top of the component)

### Step 3: Insert the Logo Image

Add an `<img>` tag with your logo path. Here's an example:

```tsx
<nav className="...">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <img 
          src="/logo.png" 
          alt="AutoHub Logo" 
          className="h-10 w-auto sm:h-12"
        />
        {/* Optional: Add text next to logo */}
        <span className="text-xl font-bold">AutoHub</span>
      </Link>
      
      {/* Rest of your navigation items */}
      ...
    </div>
  </div>
</nav>
```

### Step 4: Adjust CSS for Proper Sizing and Alignment

You can customize the logo appearance using Tailwind CSS classes:

**Common sizing classes:**
- `h-8` - Height 32px (small)
- `h-10` - Height 40px (medium)
- `h-12` - Height 48px (large)
- `w-auto` - Width automatically adjusts to maintain aspect ratio
- `w-32` - Fixed width 128px

**Responsive sizing:**
```tsx
className="h-8 w-auto sm:h-10 md:h-12"
```
This makes the logo:
- 32px height on mobile
- 40px height on small screens
- 48px height on medium+ screens

**Alignment classes:**
- `flex items-center` - Vertically centers logo with text
- `justify-center` - Horizontally centers
- `object-contain` - Maintains aspect ratio

### Step 5: Example Implementation

Here's a complete example for the Navbar:

```tsx
import Link from 'next/link'
import Image from 'next/image' // Use Next.js Image for optimization

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Link */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="AutoHub Logo"
              width={150}
              height={45}
              className="h-10 w-auto sm:h-12"
              priority
            />
            <span className="text-xl sm:text-2xl font-bold text-primary">
              AutoHub
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {/* Your navigation items */}
          </div>
        </div>
      </nav>
    </header>
  )
}
```

## 🎯 Best Practices

1. **Use Next.js Image Component**: For better performance and optimization
   ```tsx
   import Image from 'next/image'
   ```

2. **Responsive Design**: Make sure the logo looks good on all screen sizes
   ```tsx
   className="h-8 sm:h-10 md:h-12 w-auto"
   ```

3. **Accessibility**: Always include an `alt` attribute
   ```tsx
   alt="AutoHub Logo"
   ```

4. **File Location**: Keep logo files in the `public` folder for easy access
   ```
   public/logo.png
   ```

5. **File Formats**:
   - **PNG**: Best for logos with transparency
   - **SVG**: Best for scalable vector logos (recommended)
   - **JPEG**: Good for photos, but may lose quality

## 🔧 Troubleshooting

**Logo not showing?**
- Check the file path is correct (should start with `/`)
- Verify the file exists in the `public` folder
- Check browser console for 404 errors
- Ensure file name matches exactly (case-sensitive)

**Logo too large/small?**
- Adjust the `h-*` (height) classes
- Use `w-auto` to maintain aspect ratio
- Add `max-w-*` to limit maximum width

**Logo not aligned properly?**
- Use `flex items-center` for vertical alignment
- Use `justify-center` for horizontal alignment
- Add `space-x-*` for spacing between logo and text

## 📝 Quick Reference

**Basic Logo:**
```tsx
<img src="/logo.png" alt="AutoHub Logo" className="h-10 w-auto" />
```

**Logo with Next.js Image:**
```tsx
<Image src="/logo.png" alt="AutoHub Logo" width={150} height={45} />
```

**Logo with Link:**
```tsx
<Link href="/">
  <img src="/logo.png" alt="AutoHub Logo" className="h-10 w-auto" />
</Link>
```

---

**Note**: After adding your logo, make sure to test it on different screen sizes to ensure it looks good on mobile, tablet, and desktop devices.
