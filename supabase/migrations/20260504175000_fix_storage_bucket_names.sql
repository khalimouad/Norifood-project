-- Norifood: storage-bucket name fix.
-- The previous alignment migration (20260504170000) created buckets named
-- `banner-images` / `category-images` / `recipe-images`, but the frontend
-- actually uploads to `banners` / `categories` / `recipes`. Add the bucket
-- names the code uses, with public-read + admin-write policies.
-- Idempotent — safe to re-run.

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('banners',    'banners',    TRUE),
  ('categories', 'categories', TRUE),
  ('recipes',    'recipes',    TRUE)
ON CONFLICT (id) DO NOTHING;

-- Public read on the new bucket names
DROP POLICY IF EXISTS "Public read banners bucket"    ON storage.objects;
DROP POLICY IF EXISTS "Public read categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read recipes bucket"    ON storage.objects;

CREATE POLICY "Public read banners bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public read categories bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Public read recipes bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipes');

-- Replace the previous combined admin-write policy with one that includes
-- both the old and new bucket names (so older policy removal doesn't lock
-- you out of the original four buckets).
DROP POLICY IF EXISTS "Admin write images" ON storage.objects;

CREATE POLICY "Admin write images" ON storage.objects
  FOR ALL
  USING  (bucket_id IN (
            'product-images','category-images','banner-images','recipe-images',
            'banners','categories','recipes'
          ) AND public.is_admin_user(auth.uid()))
  WITH CHECK (bucket_id IN (
            'product-images','category-images','banner-images','recipe-images',
            'banners','categories','recipes'
          ) AND public.is_admin_user(auth.uid()));

-- Refresh PostgREST schema cache (no schema change here, but harmless).
NOTIFY pgrst, 'reload schema';
