-- Add has_variations column to products table
ALTER TABLE public.products 
ADD COLUMN has_variations boolean NOT NULL DEFAULT false;