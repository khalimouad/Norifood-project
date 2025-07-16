-- Add product detail fields to products table
ALTER TABLE public.products 
ADD COLUMN product_type TEXT,
ADD COLUMN origin TEXT,
ADD COLUMN storage_conditions TEXT,
ADD COLUMN shelf_life TEXT,
ADD COLUMN preparation_tips TEXT;