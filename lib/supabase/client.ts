/**
 * Supabase Client for Browser
 * 
 * Client-side Supabase client using @supabase/ssr for proper SSR support.
 * This ensures authentication works correctly in production on Vercel.
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Create browser client for client components
 * Uses createBrowserClient from @supabase/ssr for proper cookie handling
 */
export function createClientSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
