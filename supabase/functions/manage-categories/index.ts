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

    console.log(`[${method}] ${req.url}`);

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

          if (error) {
            console.error('Error fetching category:', error);
            throw error;
          }
          
          console.log('Category fetched successfully');
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

          if (error) {
            console.error('Error fetching categories:', error);
            throw error;
          }
          
          console.log(`Fetched ${categories?.length} categories`);
          return new Response(JSON.stringify(categories), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const body = await req.text();
        console.log('Request body:', body);
        
        if (!body) {
          throw new Error("Request body is required");
        }

        let newCategory;
        try {
          newCategory = JSON.parse(body);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        // Handle image upload if present
        if (newCategory.image && newCategory.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(newCategory.image.split(',')[1]), c => c.charCodeAt(0));
          const fileName = `category_${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabaseClient.storage
            .from('product-images')
            .upload(`categories/${fileName}`, imageBuffer, {
              contentType: 'image/jpeg'
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          // Get the public URL for the uploaded image
          const { data: publicUrl } = supabaseClient.storage
            .from('product-images')
            .getPublicUrl(`categories/${fileName}`);

          newCategory.image_url = publicUrl.publicUrl;
          delete newCategory.image; // Remove the base64 data
        }

        const { data: category, error: createError } = await supabaseClient
          .from("categories")
          .insert([newCategory])
          .select()
          .single();

        if (createError) {
          console.error('Error creating category:', createError);
          throw createError;
        }
        
        console.log('Category created successfully');
        return new Response(JSON.stringify(category), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!categoryId) {
          throw new Error("Category ID is required for updates");
        }
        
        const updateBody = await req.text();
        console.log('Update body:', updateBody);
        
        if (!updateBody) {
          throw new Error("Request body is required");
        }

        let updatedCategory;
        try {
          updatedCategory = JSON.parse(updateBody);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        // Handle image upload if present
        if (updatedCategory.image && updatedCategory.image.startsWith('data:')) {
          const imageBuffer = Uint8Array.from(atob(updatedCategory.image.split(',')[1]), c => c.charCodeAt(0));
          const fileName = `category_${categoryId}_${Date.now()}.jpg`;
          
          const { error: uploadError } = await supabaseClient.storage
            .from('product-images')
            .upload(`categories/${fileName}`, imageBuffer, {
              contentType: 'image/jpeg'
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw uploadError;
          }

          // Get the public URL for the uploaded image
          const { data: publicUrl } = supabaseClient.storage
            .from('product-images')
            .getPublicUrl(`categories/${fileName}`);

          updatedCategory.image_url = publicUrl.publicUrl;
          delete updatedCategory.image; // Remove the base64 data
        }

        const { data: updated, error: updateError } = await supabaseClient
          .from("categories")
          .update(updatedCategory)
          .eq("id", categoryId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating category:', updateError);
          throw updateError;
        }
        
        console.log('Category updated successfully');
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

        if (deleteError) {
          console.error('Error deleting category:', deleteError);
          throw deleteError;
        }
        
        console.log('Category deleted successfully');
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