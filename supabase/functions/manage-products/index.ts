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

    console.log(`[${method}] ${req.url}`);

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

          if (error) {
            console.error('Error fetching product:', error);
            throw error;
          }
          
          console.log('Product fetched successfully');
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

          if (error) {
            console.error('Error fetching products:', error);
            throw error;
          }
          
          console.log(`Fetched ${products?.length} products`);
          
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
        const body = await req.text();
        console.log('Request body:', body);
        
        if (!body) {
          throw new Error("Request body is required for POST requests");
        }

        let newProduct;
        try {
          newProduct = JSON.parse(body);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        // Handle image upload if present
        if (newProduct.image && newProduct.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(newProduct.image.split(',')[1]), c => c.charCodeAt(0));
          const fileName = `product_${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabaseClient.storage
            .from('product-images')
            .upload(fileName, imageBuffer, {
              contentType: 'image/jpeg'
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          // Get the public URL for the uploaded image
          const { data: publicUrl } = supabaseClient.storage
            .from('product-images')
            .getPublicUrl(fileName);

          newProduct.image_url = publicUrl.publicUrl;
        }
        
        // Always remove the image field before database insertion
        delete newProduct.image;

        const { data: product, error: createError } = await supabaseClient
          .from("products")
          .insert([newProduct])
          .select()
          .single();

        if (createError) {
          console.error('Error creating product:', createError);
          throw createError;
        }
        
        console.log('Product created successfully');
        return new Response(JSON.stringify(product), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!productId) {
          throw new Error("Product ID is required for updates");
        }
        
        const updateBody = await req.text();
        console.log('Update body:', updateBody);
        
        if (!updateBody) {
          throw new Error("Request body is required for PUT requests");
        }

        let updatedProduct;
        try {
          updatedProduct = JSON.parse(updateBody);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        // Handle image upload if present
        if (updatedProduct.image && updatedProduct.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(updatedProduct.image.split(',')[1]), c => c.charCodeAt(0));
          const fileName = `product_${productId}_${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabaseClient.storage
            .from('product-images')
            .upload(fileName, imageBuffer, {
              contentType: 'image/jpeg'
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          // Get the public URL for the uploaded image
          const { data: publicUrl } = supabaseClient.storage
            .from('product-images')
            .getPublicUrl(fileName);

          updatedProduct.image_url = publicUrl.publicUrl;
        }
        
        // Always remove the image field before database insertion
        delete updatedProduct.image;

        const { data: updated, error: updateError } = await supabaseClient
          .from("products")
          .update(updatedProduct)
          .eq("id", productId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating product:', updateError);
          throw updateError;
        }
        
        console.log('Product updated successfully');
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

        if (deleteError) {
          console.error('Error deleting product:', deleteError);
          throw deleteError;
        }
        
        console.log('Product deleted successfully');
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), { 
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});