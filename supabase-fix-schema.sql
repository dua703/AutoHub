-- ============================================
-- AutoHub: Complete Schema Fix
-- Run this SQL in your Supabase SQL Editor
-- This ensures all required columns exist
-- ============================================

-- Ensure cars table has ALL required columns
ALTER TABLE cars 
  -- Required core columns (ensure they exist)
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT 'Car', -- 'Car' or 'Bike'
  ADD COLUMN IF NOT EXISTS make TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS mileage INTEGER,
  ADD COLUMN IF NOT EXISTS transmission TEXT,
  ADD COLUMN IF NOT EXISTS engine_capacity TEXT,
  ADD COLUMN IF NOT EXISTS fuel_type TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS condition TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_currency TEXT DEFAULT 'PKR',
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS body_type TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  -- Backward compatibility columns
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS reg_city TEXT,
  ADD COLUMN IF NOT EXISTS registration_city TEXT,
  ADD COLUMN IF NOT EXISTS engine_type TEXT,
  ADD COLUMN IF NOT EXISTS assembly TEXT,
  ADD COLUMN IF NOT EXISTS exterior_color TEXT,
  ADD COLUMN IF NOT EXISTS interior_color TEXT,
  ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS seller_name TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;

-- Set default value for price_currency on existing rows
UPDATE cars SET price_currency = 'PKR' WHERE price_currency IS NULL;

-- Ensure NOT NULL constraints where needed (but avoid conflicts)
-- Note: We can't add NOT NULL if there are NULL values, so we set defaults first
UPDATE cars SET user_id = auth.uid() WHERE user_id IS NULL AND EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_deleted_at ON cars(deleted_at);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_model ON cars(model);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_price_currency ON cars(price_currency);
CREATE INDEX IF NOT EXISTS idx_cars_phone ON cars(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_registration_city ON cars(registration_city) WHERE registration_city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission) WHERE transmission IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type) WHERE fuel_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_condition ON cars(condition) WHERE condition IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_assembly ON cars(assembly) WHERE assembly IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_vehicle_type ON cars(vehicle_type) WHERE vehicle_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location) WHERE location IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN cars.id IS 'Unique identifier for the car';
COMMENT ON COLUMN cars.user_id IS 'Owner of the car listing';
COMMENT ON COLUMN cars.title IS 'Car title (auto-generated: Year Make Model)';
COMMENT ON COLUMN cars.make IS 'Car manufacturer (Toyota, Honda, etc.)';
COMMENT ON COLUMN cars.model IS 'Car model (Corolla, Civic, etc.)';
COMMENT ON COLUMN cars.year IS 'Manufacturing year';
COMMENT ON COLUMN cars.mileage IS 'Mileage in kilometers';
COMMENT ON COLUMN cars.transmission IS 'Transmission type (Automatic, Manual)';
COMMENT ON COLUMN cars.engine_capacity IS 'Engine capacity (e.g., 660cc, 1800cc)';
COMMENT ON COLUMN cars.fuel_type IS 'Fuel type (Petrol, Diesel, Hybrid, Electric)';
COMMENT ON COLUMN cars.color IS 'Car color';
COMMENT ON COLUMN cars.condition IS 'Car condition (New, Used)';
COMMENT ON COLUMN cars.price IS 'Price of the car';
COMMENT ON COLUMN cars.price_currency IS 'Currency code (default: PKR)';
COMMENT ON COLUMN cars.images IS 'Array of image URLs';
COMMENT ON COLUMN cars.body_type IS 'Body type (Sedan, SUV, Hatchback, etc.)';
COMMENT ON COLUMN cars.created_at IS 'Timestamp when car was created';
COMMENT ON COLUMN cars.updated_at IS 'Timestamp when car was last updated';
COMMENT ON COLUMN cars.deleted_at IS 'Soft delete timestamp (NULL if not deleted)';
COMMENT ON COLUMN cars.phone IS 'Seller contact phone number (normalized format: +92XXXXXXXXXX)';
COMMENT ON COLUMN cars.registration_city IS 'City where the car is registered';
COMMENT ON COLUMN cars.vehicle_type IS 'Type of vehicle: Car or Bike';
COMMENT ON COLUMN cars.location IS 'Seller location/city/area';
COMMENT ON COLUMN cars.whatsapp_enabled IS 'Whether seller wants WhatsApp contact button enabled';

-- ============================================
-- Ensure FAVORITES table has correct structure
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, car_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_car_id ON favorites(car_id);

-- ============================================
-- Ensure USER_PROFILES table exists with phone support
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email) WHERE email IS NOT NULL;

-- ============================================
-- Update RLS policies to handle soft deletes
-- ============================================

-- Update cars SELECT policy to exclude soft-deleted cars by default
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars 
  FOR SELECT 
  USING (deleted_at IS NULL);

-- Ensure users can delete their own cars (hard delete or soft delete)
DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;
CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- RLS Policies for USER_PROFILES
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to user profiles (for phone lookup during login)
DROP POLICY IF EXISTS "Allow public read access to profiles" ON user_profiles;
CREATE POLICY "Allow public read access to profiles" ON user_profiles
  FOR SELECT 
  USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Function to handle cascade delete of favorites
-- ============================================
CREATE OR REPLACE FUNCTION delete_car_favorites()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM favorites WHERE car_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_delete_car_favorites ON cars;
CREATE TRIGGER trigger_delete_car_favorites
  AFTER DELETE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION delete_car_favorites();

-- ============================================
-- Verify schema
-- ============================================
-- You can run this query to verify all columns exist:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'cars' 
-- ORDER BY ordinal_position;

