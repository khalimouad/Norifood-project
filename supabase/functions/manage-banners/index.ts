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
    const bannerId = url.searchParams.get("id");
    const platform = url.searchParams.get("platform"); // 'mobile' or 'desktop'

    switch (method) {
      case "GET":
        if (bannerId) {
          // Get single banner
          const { data: banner, error } = await supabaseClient
            .from("banners")
            .select("*")
            .eq("id", bannerId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(banner), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get banners with platform filter
          let query = supabaseClient
            .from("banners")
            .select("*")
            .eq("is_active", true)
            .order("position", { ascending: true });

          if (platform === "mobile") {
            query = query.eq("show_on_mobile", true);
          } else if (platform === "desktop") {
            query = query.eq("show_on_desktop", true);
          }

          // Filter by date range if specified
          const now = new Date().toISOString();
          query = query.or(`start_date.is.null,start_date.lte.${now}`)
                      .or(`end_date.is.null,end_date.gte.${now}`);

          const { data: banners, error } = await query;

          if (error) throw error;
          return new Response(JSON.stringify(banners), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newBanner = await req.json();
        const { data: banner, error: createError } = await supabaseClient
          .from("banners")
          .insert([newBanner])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(banner), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!bannerId) {
          throw new Error("Banner ID is required for updates");
        }
        
        const updatedBanner = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("banners")
          .update(updatedBanner)
          .eq("id", bannerId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!bannerId) {
          throw new Error("Banner ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("banners")
          .delete()
          .eq("id", bannerId);

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