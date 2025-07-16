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
    const body = await req.text();
    let requestData = {};
    
    if (body) {
      try {
        requestData = JSON.parse(body);
      } catch (e) {
        // If JSON parsing fails, continue with empty object
      }
    }
    
    const { method: requestMethod, id: bodyId, ...productData } = requestData as any;
    const url = new URL(req.url);
    const productId = url.searchParams.get("id") || bodyId;
    
    // If there's only an ID in the body and no method, treat it as a GET request
    let method = requestMethod || req.method;
    if (req.method === "POST" && bodyId && !requestMethod && Object.keys(productData).length === 0) {
      method = "GET";
    }

    console.log(`[${method}] ${req.url}`);
    console.log(`Request data:`, requestData);

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
        if (!productData || Object.keys(productData).length === 0) {
          return new Response(JSON.stringify({ error: "Request body is required for POST requests" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Extract variations from the product
        const { variations, ...newProductData } = productData;

        // Handle image upload if present
        if (newProductData.image && newProductData.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(newProductData.image.split(',')[1]), c => c.charCodeAt(0));
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

          newProductData.image_url = publicUrl.publicUrl;
        }
        
        // Always remove the image field before database insertion
        delete newProductData.image;

        const { data: product, error: createError } = await supabaseClient
          .from("products")
          .insert([newProductData])
          .select()
          .single();

        if (createError) {
          console.error('Error creating product:', createError);
          throw createError;
        }

        // Insert variations if provided
        if (variations && variations.length > 0) {
          const variationsWithProductId = variations.map(v => ({
            ...v,
            product_id: product.id
          }));
          
          const { error: variationsError } = await supabaseClient
            .from("product_variations")
            .insert(variationsWithProductId);

          if (variationsError) {
            console.error('Error creating variations:', variationsError);
            throw variationsError;
          }
        }
        
        console.log('Product created successfully');
        return new Response(JSON.stringify(product), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!productId) {
          return new Response(JSON.stringify({ error: "Product ID is required for updates" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        if (!productData || Object.keys(productData).length === 0) {
          return new Response(JSON.stringify({ error: "Request body is required for PUT requests" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Extract variations from the product
        const { variations: updateVariations, ...updateProductData } = productData;

        // Handle image upload if present
        if (updateProductData.image && updateProductData.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(updateProductData.image.split(',')[1]), c => c.charCodeAt(0));
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

          updateProductData.image_url = publicUrl.publicUrl;
        }
        
        // Always remove the image field before database insertion
        delete updateProductData.image;

        const { data: updated, error: updateError } = await supabaseClient
          .from("products")
          .update(updateProductData)
          .eq("id", productId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating product:', updateError);
          throw updateError;
        }

        // Handle variations update if provided
        if (updateVariations !== undefined) {
          // Delete existing variations
          await supabaseClient
            .from("product_variations")
            .delete()
            .eq("product_id", productId);

          // Insert new variations if any
          if (updateVariations && updateVariations.length > 0) {
            const variationsWithProductId = updateVariations.map(v => ({
              ...v,
              product_id: productId
            }));
            
            const { error: variationsError } = await supabaseClient
              .from("product_variations")
              .insert(variationsWithProductId);

            if (variationsError) {
              console.error('Error updating variations:', variationsError);
              throw variationsError;
            }
          }
        }
        
        console.log('Product updated successfully');
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!productId) {
          return new Response(JSON.stringify({ error: "Product ID is required for deletion" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
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