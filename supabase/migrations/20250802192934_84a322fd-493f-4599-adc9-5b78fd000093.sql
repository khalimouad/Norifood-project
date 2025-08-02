-- Add keywords column to products table for better search functionality
ALTER TABLE public.products 
ADD COLUMN keywords text[];

-- Add comment to explain the purpose
COMMENT ON COLUMN public.products.keywords IS 'Array of keywords to help with product search and discoverability';