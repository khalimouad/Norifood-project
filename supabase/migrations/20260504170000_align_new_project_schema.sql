-- Norifood: align new project (zkpsbrhadbblpsnhdlav) with the application schema.
-- Idempotent — safe to re-run. Adds only missing tables/columns/policies; existing
-- rows are preserved. Run this in: Supabase Dashboard → SQL Editor → paste → Run.

------------------------------------------------------------------------------
-- 1. Patch existing tables: add columns the frontend expects
------------------------------------------------------------------------------

-- Banners: admin form posts button_text/mobile_image_url/start_date/end_date
ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS button_text       TEXT,
  ADD COLUMN IF NOT EXISTS mobile_image_url  TEXT,
  ADD COLUMN IF NOT EXISTS start_date        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_date          TIMESTAMPTZ;

-- Backfill from old column names if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='banners' AND column_name='cta_label') THEN
    UPDATE public.banners SET button_text = COALESCE(button_text, cta_label);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='banners' AND column_name='starts_at') THEN
    UPDATE public.banners SET start_date = COALESCE(start_date, starts_at);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='banners' AND column_name='ends_at') THEN
    UPDATE public.banners SET end_date = COALESCE(end_date, ends_at);
  END IF;
END $$;

-- Products: admin form posts product_type/storage_conditions/shelf_life/preparation_tips/images
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type        TEXT,
  ADD COLUMN IF NOT EXISTS storage_conditions  TEXT,
  ADD COLUMN IF NOT EXISTS shelf_life          TEXT,
  ADD COLUMN IF NOT EXISTS preparation_tips    TEXT,
  ADD COLUMN IF NOT EXISTS images              TEXT[] DEFAULT '{}';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='products' AND column_name='conservation') THEN
    UPDATE public.products SET storage_conditions = COALESCE(storage_conditions, conservation);
  END IF;
END $$;

-- Categories: ensure expected columns exist
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS icon       TEXT,
  ADD COLUMN IF NOT EXISTS custom_svg TEXT;

------------------------------------------------------------------------------
-- 2. Missing tables
------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
  id         UUID PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  role       TEXT DEFAULT 'admin' CHECK (role IN ('admin','manager')),
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  weight_kg       DECIMAL(10,3),
  price           DECIMAL(10,2) NOT NULL,
  stock_quantity  INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON public.product_variations(product_id);

CREATE TABLE IF NOT EXISTS public.tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  color      TEXT DEFAULT '#3B82F6',
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_tags (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id     UUID REFERENCES public.tags(id)     ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.customers (
  id           UUID PRIMARY KEY,
  phone        TEXT,
  email        TEXT,
  first_name   TEXT,
  last_name    TEXT,
  address      TEXT,
  city         TEXT,
  postal_code  TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  guest_name          TEXT,
  guest_email         TEXT,
  guest_phone         TEXT,
  status              TEXT DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','preparing','ready','shipped','delivered','cancelled')),
  payment_method      TEXT DEFAULT 'cod' CHECK (payment_method IN ('cmi','cod')),
  payment_status      TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee        DECIMAL(10,2) DEFAULT 0,
  total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes               TEXT,
  delivery_address    TEXT NOT NULL,
  delivery_phone      TEXT NOT NULL,
  delivery_date       DATE,
  delivery_time_slot  TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON public.orders(status);

CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID REFERENCES public.orders(id)              ON DELETE CASCADE,
  product_id            UUID REFERENCES public.products(id)            ON DELETE SET NULL,
  product_variation_id  UUID REFERENCES public.product_variations(id)  ON DELETE SET NULL,
  quantity              DECIMAL(10,2) NOT NULL,
  unit_price            DECIMAL(10,2) NOT NULL,
  total_price           DECIMAL(10,2) NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  amount          DECIMAL(10,2) NOT NULL,
  currency        TEXT DEFAULT 'MAD',
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  payment_method  TEXT,
  reference       TEXT,
  raw_response    JSONB,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON public.payment_transactions(order_id);

CREATE TABLE IF NOT EXISTS public.promo_codes (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 TEXT UNIQUE NOT NULL,
  name                 TEXT,
  description          TEXT,
  discount_type        TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage','fixed')),
  discount_value       DECIMAL(10,2) NOT NULL DEFAULT 0,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  usage_limit          INTEGER DEFAULT 0,
  used_count           INTEGER DEFAULT 0,
  is_active            BOOLEAN DEFAULT TRUE,
  valid_from           TIMESTAMPTZ,
  valid_until          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recipes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  ingredients     TEXT[] DEFAULT '{}',
  instructions    TEXT[] DEFAULT '{}',
  prep_time       INTEGER DEFAULT 0,
  cook_time       INTEGER DEFAULT 0,
  servings        INTEGER DEFAULT 0,
  difficulty      TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  featured_image  TEXT,
  images          TEXT[] DEFAULT '{}',
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recipe_products (
  recipe_id  UUID REFERENCES public.recipes(id)  ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, product_id)
);

------------------------------------------------------------------------------
-- 3. Admin helper functions (idempotent)
------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
     WHERE id = user_id AND is_active = TRUE
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT public.is_admin_user(auth.uid());
$$;

------------------------------------------------------------------------------
-- 4. Enable RLS + admin-full-access policies on every table
------------------------------------------------------------------------------

ALTER TABLE public.admin_users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_products       ENABLE ROW LEVEL SECURITY;

-- Public read for the storefront
DROP POLICY IF EXISTS "Active product variations readable" ON public.product_variations;
CREATE POLICY "Active product variations readable" ON public.product_variations
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Active tags readable" ON public.tags;
CREATE POLICY "Active tags readable" ON public.tags
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Product-tags readable" ON public.product_tags;
CREATE POLICY "Product-tags readable" ON public.product_tags
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Published recipes readable" ON public.recipes;
CREATE POLICY "Published recipes readable" ON public.recipes
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Recipe-products readable" ON public.recipe_products;
CREATE POLICY "Recipe-products readable" ON public.recipe_products
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Active promo codes readable" ON public.promo_codes;
CREATE POLICY "Active promo codes readable" ON public.promo_codes
  FOR SELECT USING (is_active = TRUE);

-- Customers: own row only
DROP POLICY IF EXISTS "Customers self-read"   ON public.customers;
DROP POLICY IF EXISTS "Customers self-update" ON public.customers;
DROP POLICY IF EXISTS "Customers self-insert" ON public.customers;
CREATE POLICY "Customers self-read"   ON public.customers FOR SELECT USING (id = auth.uid());
CREATE POLICY "Customers self-update" ON public.customers FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Customers self-insert" ON public.customers FOR INSERT WITH CHECK (id = auth.uid());

-- Orders: own + insert
DROP POLICY IF EXISTS "Orders self-read"   ON public.orders;
DROP POLICY IF EXISTS "Orders self-insert" ON public.orders;
CREATE POLICY "Orders self-read"   ON public.orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Orders self-insert" ON public.orders FOR INSERT WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Order items self-read"   ON public.order_items;
DROP POLICY IF EXISTS "Order items self-insert" ON public.order_items;
CREATE POLICY "Order items self-read" ON public.order_items
  FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));
CREATE POLICY "Order items self-insert" ON public.order_items
  FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- Admin-full-access on every table (ALL = SELECT/INSERT/UPDATE/DELETE)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'products','categories','banners','product_variations','tags','product_tags',
    'customers','orders','order_items','payment_transactions','promo_codes',
    'recipes','recipe_products','admin_users'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access %s" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Admin full access %s" ON public.%I FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()))',
      t, t
    );
  END LOOP;
END $$;

------------------------------------------------------------------------------
-- 5. Storage buckets for image uploads
------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images',  'product-images',  TRUE),
  ('category-images', 'category-images', TRUE),
  ('banner-images',   'banner-images',   TRUE),
  ('recipe-images',   'recipe-images',   TRUE)
ON CONFLICT (id) DO NOTHING;

-- Public read on the four buckets, admin-only write
DROP POLICY IF EXISTS "Public read product images"  ON storage.objects;
DROP POLICY IF EXISTS "Public read category images" ON storage.objects;
DROP POLICY IF EXISTS "Public read banner images"   ON storage.objects;
DROP POLICY IF EXISTS "Public read recipe images"   ON storage.objects;
DROP POLICY IF EXISTS "Admin write images"          ON storage.objects;

CREATE POLICY "Public read product images"  ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public read category images" ON storage.objects
  FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Public read banner images"   ON storage.objects
  FOR SELECT USING (bucket_id = 'banner-images');
CREATE POLICY "Public read recipe images"   ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Admin write images" ON storage.objects
  FOR ALL
  USING  (bucket_id IN ('product-images','category-images','banner-images','recipe-images')
          AND public.is_admin_user(auth.uid()))
  WITH CHECK (bucket_id IN ('product-images','category-images','banner-images','recipe-images')
          AND public.is_admin_user(auth.uid()));

------------------------------------------------------------------------------
-- 6. Promote the existing logged-in user to admin
------------------------------------------------------------------------------

-- Replace the UUID below if the active admin auth user is different.
-- This UUID came from the JWT 'sub' in your latest console request.
INSERT INTO public.admin_users (id, email, name, role, is_active)
VALUES ('ad8f52cf-84e9-4908-9571-e25b798b7217',
        'admin@norifood.ma', 'Admin Norifood', 'admin', TRUE)
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, is_active = TRUE;

-- Done. Refresh the PostgREST schema cache so new tables/columns are picked up.
NOTIFY pgrst, 'reload schema';
