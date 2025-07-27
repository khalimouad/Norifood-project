-- Add latitude and longitude coordinates to orders table for precise delivery location
ALTER TABLE public.orders 
ADD COLUMN delivery_latitude numeric,
ADD COLUMN delivery_longitude numeric;