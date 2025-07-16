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
    const tagId = url.searchParams.get("id");

    switch (method) {
      case "GET":
        if (tagId) {
          // Get single tag with product count
          const { data: tag, error } = await supabaseClient
            .from("tags")
            .select(`
              *,
              product_tags (count)
            `)
            .eq("id", tagId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(tag), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all tags
          const { data: tags, error } = await supabaseClient
            .from("tags")
            .select(`
              *,
              product_tags (count)
            `)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify(tags), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newTag = await req.json();
        const { data: tag, error: createError } = await supabaseClient
          .from("tags")
          .insert([newTag])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(tag), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!tagId) {
          throw new Error("Tag ID is required for updates");
        }
        
        const updatedTag = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("tags")
          .update(updatedTag)
          .eq("id", tagId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!tagId) {
          throw new Error("Tag ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("tags")
          .delete()
          .eq("id", tagId);

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