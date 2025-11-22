-- Migration: Convert existing cars table to simple schema
-- Run this SQL in your Supabase SQL Editor if you have existing data

-- Add name column if it doesn't exist
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update name column from title if title exists
UPDATE cars 
SET name = COALESCE(title, make || ' ' || model || ' ' || year::text)
WHERE name IS NULL OR name = '';

-- Make name NOT NULL after migration
ALTER TABLE cars 
ALTER COLUMN name SET NOT NULL;

-- Note: Keep old columns (title, make, model, year) for backward compatibility
-- You can drop them later if needed:
-- ALTER TABLE cars DROP COLUMN IF EXISTS title;
-- ALTER TABLE cars DROP COLUMN IF EXISTS make;
-- ALTER TABLE cars DROP COLUMN IF EXISTS model;
-- ALTER TABLE cars DROP COLUMN IF EXISTS year;



