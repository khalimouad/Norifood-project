-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create RLS policies for admin_users table
CREATE POLICY "Admin users can view their own record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admin users can update their own record"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- Insert the admin user record
INSERT INTO public.admin_users (id, email, name, role, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@freshngood.com' LIMIT 1),
  'admin@freshngood.com',
  'Admin User',
  'admin',
  true
) ON CONFLICT (id) DO NOTHING;