-- ============================================
-- AutoHub: Initial Schema Migration
-- Run this SQL in your Supabase SQL Editor
-- Creates all required tables if they don't exist
-- ============================================

-- ============================================
-- 1. CARS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  make TEXT,
  model TEXT,
  year INTEGER,
  mileage INTEGER,
  transmission TEXT,
  engine_capacity TEXT,
  fuel_type TEXT,
  color TEXT,
  condition TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  price_currency TEXT DEFAULT 'PKR',
  images TEXT[] DEFAULT '{}',
  body_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Backward compatibility fields
  name TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  reg_city TEXT,
  registration_city TEXT,
  engine_type TEXT,
  assembly TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  features TEXT[] DEFAULT '{}',
  phone TEXT,
  seller_name TEXT
);

-- Create indexes for cars table
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

-- ============================================
-- 2. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(car_id, user_id)
);

-- Create indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================
-- 3. FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, car_id)
);

-- Create indexes for favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_car_id ON favorites(car_id);

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CARS RLS POLICIES
-- ============================================
-- Allow public read access to non-deleted cars
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars 
  FOR SELECT 
  USING (deleted_at IS NULL);

-- Users can insert their own cars
DROP POLICY IF EXISTS "Users can insert their own cars" ON cars;
CREATE POLICY "Users can insert their own cars" ON cars
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cars
DROP POLICY IF EXISTS "Users can update their own cars" ON cars;
CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cars
DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;
CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 6. REVIEWS RLS POLICIES
-- ============================================
-- Allow public read access to reviews
DROP POLICY IF EXISTS "Allow public read access to reviews" ON reviews;
CREATE POLICY "Allow public read access to reviews" ON reviews
  FOR SELECT 
  USING (true);

-- Users can create reviews
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 7. FAVORITES RLS POLICIES
-- ============================================
-- Users can view their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can add their own favorites
DROP POLICY IF EXISTS "Users can add their own favorites" ON favorites;
CREATE POLICY "Users can add their own favorites" ON favorites
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 8. FUNCTION TO HANDLE CASCADE DELETE OF FAVORITES
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

