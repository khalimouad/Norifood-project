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
    const { email, password } = await req.json();

    console.log('Resetting password for user:', email);

    // Find user by email
    const { data: users, error: listError } = await supabaseClient.auth.admin.listUsers();
    
    if (listError) throw listError;

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Update user password
    const { data, error } = await supabaseClient.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (error) throw error;

    console.log('Password updated successfully for:', email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password updated successfully' 
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
