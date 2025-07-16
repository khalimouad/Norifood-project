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
    const productId = url.searchParams.get("id");

    switch (method) {
      case "GET":
        if (productId) {
          // Get single product with variations and tags
          const { data: product, error } = await supabaseClient
            .from("products")
            .select(`
              *,
              categories (name, slug),
              product_variations (*),
              product_tags (
                tags (*)
              )
            `)
            .eq("id", productId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(product), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all products with pagination
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const search = url.searchParams.get("search") || "";
          const category = url.searchParams.get("category") || "";
          
          let query = supabaseClient
            .from("products")
            .select(`
              *,
              categories (name, slug),
              product_variations (*),
              product_tags (
                tags (*)
              )
            `, { count: "exact" })
            .order("created_at", { ascending: false });

          if (search) {
            query = query.ilike("name", `%${search}%`);
          }
          
          if (category) {
            query = query.eq("category_id", category);
          }

          const { data: products, error, count } = await query
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;
          
          return new Response(JSON.stringify({
            products,
            total: count,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newProduct = await req.json();
        const { data: product, error: createError } = await supabaseClient
          .from("products")
          .insert([newProduct])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(product), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!productId) {
          throw new Error("Product ID is required for updates");
        }
        
        const updatedProduct = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("products")
          .update(updatedProduct)
          .eq("id", productId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!productId) {
          throw new Error("Product ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("products")
          .delete()
          .eq("id", productId);

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