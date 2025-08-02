-- Phase 1: Critical Database Security Fixes

-- Fix admin access policies to use proper admin validation instead of 'true'
-- Update all admin policies to use the is_admin_user function

-- Products admin policies
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
CREATE POLICY "Admin full access products" 
ON public.products 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Categories admin policies  
DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
CREATE POLICY "Admin full access categories" 
ON public.categories 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Orders admin policies
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Admin full access orders" 
ON public.orders 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Customers admin policies
DROP POLICY IF EXISTS "Admin full access customers" ON public.customers;
CREATE POLICY "Admin full access customers" 
ON public.customers 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Payment transactions admin policies
DROP POLICY IF EXISTS "Admin full access payment transactions" ON public.payment_transactions;
CREATE POLICY "Admin full access payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Promo codes admin policies
DROP POLICY IF EXISTS "Admin full access promo codes" ON public.promo_codes;
CREATE POLICY "Admin full access promo codes" 
ON public.promo_codes 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Recipes admin policies
DROP POLICY IF EXISTS "Admin full access recipes" ON public.recipes;
CREATE POLICY "Admin full access recipes" 
ON public.recipes 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Banners admin policies
DROP POLICY IF EXISTS "Admin full access banners" ON public.banners;
CREATE POLICY "Admin full access banners" 
ON public.banners 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Tags admin policies
DROP POLICY IF EXISTS "Admin full access tags" ON public.tags;
CREATE POLICY "Admin full access tags" 
ON public.tags 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Product variations admin policies
DROP POLICY IF EXISTS "Admin full access variations" ON public.product_variations;
CREATE POLICY "Admin full access variations" 
ON public.product_variations 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Product tags admin policies
DROP POLICY IF EXISTS "Admin full access product tags" ON public.product_tags;
CREATE POLICY "Admin full access product tags" 
ON public.product_tags 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Recipe products admin policies
DROP POLICY IF EXISTS "Admin full access recipe products" ON public.recipe_products;
CREATE POLICY "Admin full access recipe products" 
ON public.recipe_products 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Order items admin policies
DROP POLICY IF EXISTS "Admin full access order items" ON public.order_items;
CREATE POLICY "Admin full access order items" 
ON public.order_items 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Blog posts admin policies
DROP POLICY IF EXISTS "Admin full access blog posts" ON public.blog_posts;
CREATE POLICY "Admin full access blog posts" 
ON public.blog_posts 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Blog categories admin policies
DROP POLICY IF EXISTS "Admin full access blog categories" ON public.blog_categories;
CREATE POLICY "Admin full access blog categories" 
ON public.blog_categories 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Blog post categories admin policies
DROP POLICY IF EXISTS "Admin full access blog post categories" ON public.blog_post_categories;
CREATE POLICY "Admin full access blog post categories" 
ON public.blog_post_categories 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Admin users admin policies
DROP POLICY IF EXISTS "Admin full access admin users" ON public.admin_users;
CREATE POLICY "Admin full access admin users" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Update security definer functions to prevent SQL injection
-- Fix the is_admin_user function to be more secure
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND is_active = true
  );
END;
$function$;

-- Update other functions to use secure search_path
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_product_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_category_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$function$;