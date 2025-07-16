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
    const { method } = req;
    const url = new URL(req.url);
    const promoId = url.searchParams.get("id");
    const validateCode = url.searchParams.get("validate");

    switch (method) {
      case "GET":
        if (validateCode) {
          // Validate promo code
          const { data: promoCode, error } = await supabaseClient
            .from("promo_codes")
            .select("*")
            .eq("code", validateCode)
            .eq("is_active", true)
            .single();

          if (error) {
            return new Response(JSON.stringify({ 
              valid: false, 
              error: "Code not found" 
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          const now = new Date();
          const validFrom = new Date(promoCode.valid_from);
          const validUntil = promoCode.valid_until ? new Date(promoCode.valid_until) : null;
          
          const isValid = now >= validFrom && 
                          (!validUntil || now <= validUntil) &&
                          (!promoCode.usage_limit || promoCode.used_count < promoCode.usage_limit);

          return new Response(JSON.stringify({
            valid: isValid,
            promoCode: isValid ? promoCode : null,
            error: isValid ? null : "Code expired or usage limit reached"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (promoId) {
          // Get single promo code
          const { data: promoCode, error } = await supabaseClient
            .from("promo_codes")
            .select("*")
            .eq("id", promoId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(promoCode), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all promo codes
          const { data: promoCodes, error } = await supabaseClient
            .from("promo_codes")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify(promoCodes), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newPromoCode = await req.json();
        const { data: promoCode, error: createError } = await supabaseClient
          .from("promo_codes")
          .insert([newPromoCode])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(promoCode), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!promoId) {
          throw new Error("Promo code ID is required for updates");
        }
        
        const updatedPromoCode = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("promo_codes")
          .update(updatedPromoCode)
          .eq("id", promoId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!promoId) {
          throw new Error("Promo code ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("promo_codes")
          .delete()
          .eq("id", promoId);

        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      default:
        return new Response("Method not allowed", { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});