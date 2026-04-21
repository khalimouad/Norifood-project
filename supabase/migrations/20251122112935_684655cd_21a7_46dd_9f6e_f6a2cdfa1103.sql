-- Create CMI configuration table
CREATE TABLE IF NOT EXISTS public.cmi_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id text NOT NULL,
  merchant_key text NOT NULL,
  gateway_url text NOT NULL DEFAULT 'https://payment.cmi.co.ma/fim/api',
  is_active boolean DEFAULT true,
  test_mode boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cmi_config ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access cmi config"
ON public.cmi_config
FOR ALL
TO authenticated
USING (is_admin_user(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_cmi_config_updated_at
  BEFORE UPDATE ON public.cmi_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default configuration
INSERT INTO public.cmi_config (merchant_id, merchant_key, gateway_url, test_mode)
VALUES ('MERCHANT_ID', 'MERCHANT_KEY', 'https://payment.cmi.co.ma/fim/api', true)
ON CONFLICT DO NOTHING;