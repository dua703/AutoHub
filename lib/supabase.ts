/**
 * Supabase Client and Type Definitions
 * 
 * Provides Supabase client instance and TypeScript interfaces
 * for all database entities.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Car interface with all fields matching database schema
 */
export interface Car {
  id: string
  user_id: string
  title?: string
  make?: string
  model?: string
  year?: number
  mileage?: number
  transmission?: string
  engine_capacity?: string
  fuel_type?: string
  color?: string
  condition?: string
  price: number
  price_currency?: string // Default: 'PKR'
  images: string[]
  body_type?: string
  created_at: string
  updated_at?: string
  deleted_at?: string // Soft delete timestamp
  // Backward compatibility fields
  name?: string
  description?: string
  category?: string
  location?: string
  reg_city?: string
  registration_city?: string
  engine_type?: string
  assembly?: string
  exterior_color?: string
  interior_color?: string
  features?: string[]
  phone?: string
  seller_name?: string
}

/**
 * Favorite interface
 */
export interface Favorite {
  id: string
  user_id: string
  car_id: string
  created_at: string
}

/**
 * Review interface
 */
export interface Review {
  id: string
  car_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at?: string
  user_profile?: {
    full_name?: string
    email?: string
  }
}

/**
 * ContactMessage interface
 */
export interface ContactMessage {
  id: string
  car_id: string
  sender_id?: string
  seller_id: string
  name: string
  email: string
  phone?: string
  message: string
  read: boolean
  created_at: string
}

/**
 * UserProfile interface
 */
export interface UserProfile {
  id: string
  email?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
  updated_at?: string
}
