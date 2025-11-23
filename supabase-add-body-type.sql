-- Add body_type column to cars table if it doesn't exist
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS body_type TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);

-- Add comment for documentation
COMMENT ON COLUMN cars.body_type IS 'Body type of the car (Sedan, SUV, Hatchback, etc.)';

