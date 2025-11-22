/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for UploadThing
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // TypeScript and ESLint
  typescript: {
    // Set to false in production if you want to skip type checking during build
    // For production, it's recommended to keep this true
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to false in production if you want to skip ESLint during build
    // For production, it's recommended to keep this true
    ignoreDuringBuilds: false,
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
