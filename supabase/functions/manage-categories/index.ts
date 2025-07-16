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
    const categoryId = url.searchParams.get("id");

    switch (method) {
      case "GET":
        if (categoryId) {
          // Get single category with product count
          const { data: category, error } = await supabaseClient
            .from("categories")
            .select(`
              *,
              products (count)
            `)
            .eq("id", categoryId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(category), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all categories
          const { data: categories, error } = await supabaseClient
            .from("categories")
            .select(`
              *,
              products (count)
            `)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify(categories), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newCategory = await req.json();
        const { data: category, error: createError } = await supabaseClient
          .from("categories")
          .insert([newCategory])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(category), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!categoryId) {
          throw new Error("Category ID is required for updates");
        }
        
        const updatedCategory = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("categories")
          .update(updatedCategory)
          .eq("id", categoryId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!categoryId) {
          throw new Error("Category ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("categories")
          .delete()
          .eq("id", categoryId);

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