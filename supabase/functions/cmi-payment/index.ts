import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CMI Payment Processing Function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { method } = req;
    
    if (method === 'POST') {
      const requestData = await req.json();
      const { action, ...data } = requestData;

      switch (action) {
        case 'create_payment':
          return await createPayment(data, supabase);
        case 'verify_payment':
          return await verifyPayment(data, supabase);
        case 'process_callback':
          return await processCallback(data, supabase);
        default:
          throw new Error('Invalid action');
      }
    }

    throw new Error('Method not allowed');
  } catch (error) {
    console.error('CMI Payment Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createPayment(data: any, supabase: any) {
  console.log('Creating CMI payment request:', data);
  
  // Dummy CMI credentials - replace with real ones later
  const CMI_MERCHANT_ID = Deno.env.get('CMI_MERCHANT_ID') || 'DUMMY_MERCHANT_123';
  const CMI_MERCHANT_KEY = Deno.env.get('CMI_MERCHANT_KEY') || 'dummy_key_for_testing';
  const CMI_GATEWAY_URL = Deno.env.get('CMI_GATEWAY_URL') || 'https://dummy-cmi-gateway.com/payment';
  
  const {
    amount,
    currency = 'MAD',
    orderId,
    customerEmail,
    customerPhone,
    customerName,
    returnUrl,
    cancelUrl
  } = data;

  // Create order in database
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      total_amount: amount,
      payment_method: 'cmi',
      payment_status: 'pending',
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_name: customerName,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create order');
  }

  // Generate CMI payment parameters
  const paymentParams = {
    merchantId: CMI_MERCHANT_ID,
    amount: (amount * 100).toString(), // Convert to cents
    currency: currency,
    orderId: orderId,
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    customerName: customerName,
    returnUrl: returnUrl,
    cancelUrl: cancelUrl,
    language: 'fr',
    timestamp: new Date().toISOString()
  };

  // Generate hash for security (dummy implementation)
  const hashString = `${paymentParams.merchantId}${paymentParams.orderId}${paymentParams.amount}${paymentParams.currency}${CMI_MERCHANT_KEY}`;
  const hash = await generateDummyHash(hashString);
  paymentParams.hash = hash;

  // For dummy implementation, return a mock payment URL
  const paymentUrl = `${CMI_GATEWAY_URL}?` + new URLSearchParams(paymentParams).toString();
  
  console.log('CMI Payment URL generated:', paymentUrl);
  
  return new Response(
    JSON.stringify({
      success: true,
      paymentUrl: paymentUrl,
      orderId: orderId,
      transactionId: `TXN_${Date.now()}`
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function verifyPayment(data: any, supabase: any) {
  console.log('Verifying CMI payment:', data);
  
  const { orderId, transactionId, status } = data;
  
  // For dummy implementation, simulate payment verification
  const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate for testing
  
  const paymentStatus = isPaymentSuccessful ? 'paid' : 'failed';
  
  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      transaction_id: transactionId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (updateError) {
    console.error('Error updating order:', updateError);
    throw new Error('Failed to update order status');
  }

  return new Response(
    JSON.stringify({
      success: true,
      paymentStatus: paymentStatus,
      orderId: orderId,
      transactionId: transactionId,
      verified: isPaymentSuccessful
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function processCallback(data: any, supabase: any) {
  console.log('Processing CMI callback:', data);
  
  const { orderId, status, transactionId, hash } = data;
  
  // Verify hash (dummy implementation)
  const expectedHash = await generateDummyHash(`${orderId}${status}${transactionId}`);
  
  if (hash !== expectedHash) {
    throw new Error('Invalid hash - potential fraud detected');
  }
  
  // Update order based on callback
  const paymentStatus = status === 'SUCCESS' ? 'paid' : 'failed';
  
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      transaction_id: transactionId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (updateError) {
    console.error('Error updating order from callback:', updateError);
    throw new Error('Failed to update order from callback');
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Callback processed successfully',
      orderId: orderId,
      status: paymentStatus
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Dummy hash generation for testing
async function generateDummyHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}