-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_tags junction table
CREATE TABLE public.product_tags (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  minimum_order_amount NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  featured_image TEXT,
  images TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recipe_products junction table (for related products)
CREATE TABLE public.recipe_products (
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity NUMERIC,
  unit TEXT,
  PRIMARY KEY (recipe_id, product_id)
);

-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  button_text TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  show_on_mobile BOOLEAN DEFAULT true,
  show_on_desktop BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  transaction_id TEXT,
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MAD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Tags are viewable by everyone" ON public.tags
  FOR SELECT USING (is_active = true);

CREATE POLICY "Product tags are viewable by everyone" ON public.product_tags
  FOR SELECT USING (true);

CREATE POLICY "Published recipes are viewable by everyone" ON public.recipes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Recipe products are viewable by everyone" ON public.recipe_products
  FOR SELECT USING (true);

CREATE POLICY "Active banners are viewable by everyone" ON public.banners
  FOR SELECT USING (is_active = true);

-- Create admin policies
CREATE POLICY "Admin full access tags" ON public.tags
  FOR ALL USING (true);

CREATE POLICY "Admin full access product tags" ON public.product_tags
  FOR ALL USING (true);

CREATE POLICY "Admin full access promo codes" ON public.promo_codes
  FOR ALL USING (true);

CREATE POLICY "Admin full access recipes" ON public.recipes
  FOR ALL USING (true);

CREATE POLICY "Admin full access recipe products" ON public.recipe_products
  FOR ALL USING (true);

CREATE POLICY "Admin full access banners" ON public.banners
  FOR ALL USING (true);

CREATE POLICY "Admin full access payment transactions" ON public.payment_transactions
  FOR ALL USING (true);

-- Create policies for customers to view their own payment transactions
CREATE POLICY "Customers can view their own payment transactions" ON public.payment_transactions
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE customer_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.tags (name, slug, color) VALUES
  ('Frais', 'frais', '#10B981'),
  ('Bio', 'bio', '#059669'),
  ('Surgelé', 'surgele', '#3B82F6'),
  ('Premium', 'premium', '#F59E0B'),
  ('Promotion', 'promotion', '#EF4444');

INSERT INTO public.promo_codes (code, name, description, discount_type, discount_value, minimum_order_amount, usage_limit, valid_until) VALUES
  ('WELCOME10', 'Bienvenue', 'Réduction de 10% pour les nouveaux clients', 'percentage', 10, 100, 100, now() + interval '30 days'),
  ('FRESH50', 'Produits Frais', 'Réduction de 50 DH sur les produits frais', 'fixed', 50, 200, 50, now() + interval '15 days');

INSERT INTO public.banners (title, subtitle, image_url, link_url, button_text, position, show_on_mobile) VALUES
  ('Produits Frais du Jour', 'Découvrez notre sélection quotidienne', '/placeholder.svg', '/products', 'Voir les Produits', 1, true),
  ('Livraison Gratuite', 'Commande minimum 200 DH', '/placeholder.svg', '/products', 'Commander', 2, true);