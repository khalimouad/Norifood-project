-- Add missing RLS policies for customers table to prevent anonymous access

-- Policy for customers to insert their own data (when creating account)
CREATE POLICY "Customers can insert their own data"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Policy for deleting customer records (admin only)
CREATE POLICY "Admin can delete customers"
ON public.customers
FOR DELETE
TO authenticated
USING (is_admin_user(auth.uid()));

-- Note: Existing policies already cover:
-- - SELECT: Customers can view their own data + Admin full access
-- - UPDATE: Customers can update their own data + Admin full access
-- Anonymous users are implicitly denied as no policies match for them