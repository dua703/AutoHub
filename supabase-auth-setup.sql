-- AutoHub Authentication & User Setup
-- Run this SQL in your Supabase SQL Editor after the initial setup

-- Add user_id column to cars table if it doesn't exist
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add updated_at column if it doesn't exist
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies for authenticated users
DROP POLICY IF EXISTS "Users can insert their own cars" ON cars;
CREATE POLICY "Users can insert their own cars" ON cars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cars" ON cars;
CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;
CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE
  USING (auth.uid() = user_id);

-- Keep public read access
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);








