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
DROP POLICY IF EXISTS "Admin users can view their own record" ON public.admin_users;
CREATE POLICY "Admin users can view their own record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin users can update their own record" ON public.admin_users;
CREATE POLICY "Admin users can update their own record"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (id = auth.uid());