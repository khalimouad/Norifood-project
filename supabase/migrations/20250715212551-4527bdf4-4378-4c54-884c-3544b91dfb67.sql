-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table with flexible units
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  base_price DECIMAL(10,2) NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('kg', 'units', 'g', 'pieces')),
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity DECIMAL(10,2) DEFAULT 1,
  max_order_quantity DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create product variations for specific weights/pieces
CREATE TABLE public.product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Large Fish - 1.2kg", "Medium Fish - 1.3kg"
  weight_kg DECIMAL(10,3), -- actual weight for pieces
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  guest_phone TEXT,
  guest_name TEXT,
  guest_email TEXT,
  guest_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cmi', 'cod')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_date DATE,
  delivery_time_slot TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_variation_id UUID REFERENCES public.product_variations(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog posts table for recipes
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_name TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog categories
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog post categories junction table
CREATE TABLE public.blog_post_categories (
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  blog_category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, blog_category_id)
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to products and categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Product variations are viewable by everyone" 
ON public.product_variations FOR SELECT 
USING (is_active = true);

CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts FOR SELECT 
USING (is_published = true);

CREATE POLICY "Blog categories are viewable by everyone" 
ON public.blog_categories FOR SELECT 
USING (true);

CREATE POLICY "Blog post categories are viewable by everyone" 
ON public.blog_post_categories FOR SELECT 
USING (true);

-- Create policies for customers
CREATE POLICY "Customers can view their own data" 
ON public.customers FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Customers can update their own data" 
ON public.customers FOR UPDATE 
USING (id = auth.uid());

-- Create policies for orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders FOR SELECT 
USING (customer_id = auth.uid());

CREATE POLICY "Order items are viewable by order owner" 
ON public.order_items FOR SELECT 
USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- Create policies for admin operations (these will be handled by service role)
CREATE POLICY "Admin full access categories" 
ON public.categories FOR ALL 
USING (true);

CREATE POLICY "Admin full access products" 
ON public.products FOR ALL 
USING (true);

CREATE POLICY "Admin full access variations" 
ON public.product_variations FOR ALL 
USING (true);

CREATE POLICY "Admin full access orders" 
ON public.orders FOR ALL 
USING (true);

CREATE POLICY "Admin full access order items" 
ON public.order_items FOR ALL 
USING (true);

CREATE POLICY "Admin full access customers" 
ON public.customers FOR ALL 
USING (true);

CREATE POLICY "Admin full access blog posts" 
ON public.blog_posts FOR ALL 
USING (true);

CREATE POLICY "Admin full access blog categories" 
ON public.blog_categories FOR ALL 
USING (true);

CREATE POLICY "Admin full access blog post categories" 
ON public.blog_post_categories FOR ALL 
USING (true);

CREATE POLICY "Admin full access admin users" 
ON public.admin_users FOR ALL 
USING (true);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variations_updated_at 
  BEFORE UPDATE ON public.product_variations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON public.customers 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
  BEFORE UPDATE ON public.blog_posts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON public.admin_users 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.categories (name, description, slug) VALUES 
('Fresh Fish', 'Daily fresh fish selection', 'fresh-fish'),
('Seafood', 'Premium seafood selection', 'seafood'),
('Frozen', 'Frozen fish and seafood', 'frozen'),
('Prepared', 'Ready-to-cook preparations', 'prepared');

INSERT INTO public.blog_categories (name, slug, description) VALUES 
('Recipes', 'recipes', 'Fish and seafood recipes'),
('Cooking Tips', 'cooking-tips', 'Tips for cooking fish and seafood'),
('Nutrition', 'nutrition', 'Health benefits of fish and seafood');