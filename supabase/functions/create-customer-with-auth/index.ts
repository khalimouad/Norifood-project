import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { email, password, first_name, last_name, phone, address, city, postal_code } = await req.json();

    console.log('Creating customer with auth user:', { email, phone });

    // Create auth user with password
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log('Auth user created:', authData.user.id);

    // Create customer record with the same ID as auth user
    const { data: customerData, error: customerError } = await supabaseClient
      .from('customers')
      .insert([{
        id: authData.user.id,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        postal_code,
        is_active: true
      }])
      .select()
      .single();

    if (customerError) {
      console.error('Customer creation error:', customerError);
      // Rollback: delete auth user if customer creation fails
      await supabaseClient.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Failed to create customer: ${customerError.message}`);
    }

    console.log('Customer created successfully:', customerData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer: customerData,
        message: 'Customer created successfully' 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        success: false 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
