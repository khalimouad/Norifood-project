-- Create policies for orders (without IF NOT EXISTS)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (customer_id = auth.uid());

CREATE POLICY "Admin full access orders" 
ON public.orders 
FOR ALL 
USING (true);

-- Create policies for order_items
CREATE POLICY "Order items are viewable by order owner" 
ON public.order_items 
FOR SELECT 
USING (order_id IN (
  SELECT id FROM public.orders WHERE customer_id = auth.uid()
));

CREATE POLICY "Admin full access order items" 
ON public.order_items 
FOR ALL 
USING (true);