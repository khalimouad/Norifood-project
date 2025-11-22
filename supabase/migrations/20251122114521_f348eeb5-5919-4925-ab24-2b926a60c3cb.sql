-- Fix security issues for cmi_config and customers tables

-- CMI Config Table: Add explicit denial policies for non-admin users
-- This ensures that even if RLS is somehow bypassed, non-admins cannot access payment credentials

-- Deny SELECT for non-admins (only admins can view)
CREATE POLICY "Non-admins cannot view CMI config"
ON public.cmi_config
FOR SELECT
TO authenticated
USING (is_admin_user(auth.uid()));

-- Deny all operations for anonymous users on cmi_config
CREATE POLICY "Anonymous users denied on CMI config"
ON public.cmi_config
FOR ALL
TO anon
USING (false);

-- Customers Table: Add explicit denial for anonymous users
-- This prevents any anonymous access attempts

CREATE POLICY "Anonymous users denied on customers"
ON public.customers
FOR ALL
TO anon
USING (false);

-- Add comment explaining security measures
COMMENT ON TABLE public.cmi_config IS 'Payment gateway credentials - Admin access only. Sensitive data should be encrypted at application layer for production use.';
COMMENT ON TABLE public.customers IS 'Customer personal information - Protected by RLS. Only authenticated users can access their own data, admins can access all.';