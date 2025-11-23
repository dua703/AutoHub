-- AutoHub Soft Delete Migration
-- Run this SQL in your Supabase SQL Editor
-- This adds soft delete support to prevent deleted cars from showing

-- Add deleted_at column to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_deleted_at ON cars(deleted_at) WHERE deleted_at IS NULL;

-- Update RLS policy to filter out deleted cars for public read
-- Note: This is handled in application queries, but we can also add a view
DROP POLICY IF EXISTS "Allow public read access" ON cars;
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT 
  USING (deleted_at IS NULL);

-- Update user insert policy to ensure deleted_at is null on insert
DROP POLICY IF EXISTS "Users can insert their own cars" ON cars;
CREATE POLICY "Users can insert their own cars" ON cars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND deleted_at IS NULL);

-- Update user update policy
DROP POLICY IF EXISTS "Users can update their own cars" ON cars;
CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- Update delete policy to allow soft delete (setting deleted_at)
DROP POLICY IF EXISTS "Users can delete their own cars" ON cars;
CREATE POLICY "Users can delete their own cars" ON cars
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle soft delete
CREATE OR REPLACE FUNCTION soft_delete_car()
RETURNS TRIGGER AS $$
BEGIN
  -- Instead of deleting, set deleted_at timestamp
  IF (TG_OP = 'DELETE') THEN
    UPDATE cars 
    SET deleted_at = TIMEZONE('utc'::text, NOW())
    WHERE id = OLD.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for soft delete (optional - we'll handle in application code)
-- DROP TRIGGER IF EXISTS soft_delete_car_trigger ON cars;
-- CREATE TRIGGER soft_delete_car_trigger
--   INSTEAD OF DELETE ON cars
--   FOR EACH ROW
--   EXECUTE FUNCTION soft_delete_car();

