-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Admin can upload product images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin can update product images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin can delete product images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Product images are viewable by everyone"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Create function to generate slugs automatically
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              unaccent(input_text), 
              '[àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ]', 
              'a', 'gi'
            ),
            '[^a-z0-9\s-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger function to auto-generate slugs for products
CREATE OR REPLACE FUNCTION public.auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.name);
    
    -- Ensure slug is unique
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')) LOOP
      NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 8);
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate slugs for categories
CREATE OR REPLACE FUNCTION public.auto_generate_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.name);
    
    -- Ensure slug is unique
    WHILE EXISTS (SELECT 1 FROM categories WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')) LOOP
      NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 8);
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-slug generation
CREATE TRIGGER trigger_auto_generate_product_slug
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_product_slug();

CREATE TRIGGER trigger_auto_generate_category_slug
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_category_slug();