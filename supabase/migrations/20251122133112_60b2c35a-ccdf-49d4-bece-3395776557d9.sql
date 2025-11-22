-- Fix security issue for orders table - protect guest customer data

-- Drop existing policies that may allow unauthorized access
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Deny all access to anonymous users on orders table
CREATE POLICY "Anonymous users denied on orders"
ON public.orders
FOR ALL
TO anon
USING (false);

-- Admin full access to all orders
CREATE POLICY "Admin full access orders"
ON public.orders
FOR ALL
TO authenticated
USING (is_admin_user(auth.uid()));

-- Allow authenticated customers to view only their own orders
CREATE POLICY "Customers can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Allow authenticated customers to insert orders for themselves
CREATE POLICY "Customers can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Add security comment
COMMENT ON TABLE public.orders IS 'Orders with customer PII - Protected by RLS. Guest data in guest_* columns only accessible to admins. Customers can only access orders where customer_id matches their auth.uid().';