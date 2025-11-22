-- AutoHub: Add comprehensive car listing fields
-- Run this SQL in your Supabase SQL Editor

-- Add new columns to cars table if they don't exist
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS reg_city TEXT,
ADD COLUMN IF NOT EXISTS engine_type TEXT,
ADD COLUMN IF NOT EXISTS engine_capacity TEXT,
ADD COLUMN IF NOT EXISTS assembly TEXT,
ADD COLUMN IF NOT EXISTS exterior_color TEXT,
ADD COLUMN IF NOT EXISTS interior_color TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS seller_name TEXT;

-- Update existing columns if needed (make sure make, model, year exist)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS make TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_reg_city ON cars(reg_city);
CREATE INDEX IF NOT EXISTS idx_cars_engine_type ON cars(engine_type);
CREATE INDEX IF NOT EXISTS idx_cars_assembly ON cars(assembly);
CREATE INDEX IF NOT EXISTS idx_cars_features ON cars USING GIN(features);

-- Add comments for documentation
COMMENT ON COLUMN cars.reg_city IS 'Registration city of the vehicle';
COMMENT ON COLUMN cars.engine_type IS 'Engine type: Petrol, Diesel, Hybrid, Electric';
COMMENT ON COLUMN cars.engine_capacity IS 'Engine capacity (e.g., 660cc, 1000cc, 1800cc)';
COMMENT ON COLUMN cars.assembly IS 'Assembly type: Local or Imported';
COMMENT ON COLUMN cars.exterior_color IS 'Exterior color of the vehicle';
COMMENT ON COLUMN cars.interior_color IS 'Interior color of the vehicle';
COMMENT ON COLUMN cars.features IS 'Array of features (ABS, Airbags, Sunroof, etc.)';
COMMENT ON COLUMN cars.phone IS 'Seller contact phone number';
COMMENT ON COLUMN cars.seller_name IS 'Name of the seller';

