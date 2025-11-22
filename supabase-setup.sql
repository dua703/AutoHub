-- AutoHub Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Create a policy to allow public insert access
DROP POLICY IF EXISTS "Allow public insert access" ON cars;
CREATE POLICY "Allow public insert access" ON cars
  FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);

