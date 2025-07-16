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
    const recipeId = url.searchParams.get("id");

    switch (method) {
      case "GET":
        if (recipeId) {
          // Get single recipe with related products
          const { data: recipe, error } = await supabaseClient
            .from("recipes")
            .select(`
              *,
              recipe_products (
                quantity,
                unit,
                products (*)
              )
            `)
            .eq("id", recipeId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(recipe), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all recipes with pagination
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const search = url.searchParams.get("search") || "";
          const published = url.searchParams.get("published");
          
          let query = supabaseClient
            .from("recipes")
            .select(`
              *,
              recipe_products (
                quantity,
                unit,
                products (name, image_url)
              )
            `, { count: "exact" })
            .order("created_at", { ascending: false });

          if (search) {
            query = query.ilike("title", `%${search}%`);
          }
          
          if (published !== null) {
            query = query.eq("is_published", published === "true");
          }

          const { data: recipes, error, count } = await query
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;
          
          return new Response(JSON.stringify({
            recipes,
            total: count,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newRecipe = await req.json();
        const { data: recipe, error: createError } = await supabaseClient
          .from("recipes")
          .insert([newRecipe])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(recipe), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!recipeId) {
          throw new Error("Recipe ID is required for updates");
        }
        
        const updatedRecipe = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("recipes")
          .update(updatedRecipe)
          .eq("id", recipeId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!recipeId) {
          throw new Error("Recipe ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("recipes")
          .delete()
          .eq("id", recipeId);

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