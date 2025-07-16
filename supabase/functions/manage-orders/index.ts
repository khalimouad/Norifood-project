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
    const orderId = url.searchParams.get("id");

    switch (method) {
      case "GET":
        if (orderId) {
          // Get single order with items and customer
          const { data: order, error } = await supabaseClient
            .from("orders")
            .select(`
              *,
              customers (first_name, last_name, email, phone),
              order_items (
                *,
                products (name, image_url),
                product_variations (name, weight_kg)
              ),
              payment_transactions (*)
            `)
            .eq("id", orderId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(order), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all orders with pagination and filters
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const status = url.searchParams.get("status") || "";
          const dateFrom = url.searchParams.get("dateFrom") || "";
          const dateTo = url.searchParams.get("dateTo") || "";
          
          let query = supabaseClient
            .from("orders")
            .select(`
              *,
              customers (first_name, last_name, email, phone),
              order_items (
                *,
                products (name, image_url)
              )
            `, { count: "exact" })
            .order("created_at", { ascending: false });

          if (status) {
            query = query.eq("status", status);
          }
          
          if (dateFrom) {
            query = query.gte("created_at", dateFrom);
          }
          
          if (dateTo) {
            query = query.lte("created_at", dateTo);
          }

          const { data: orders, error, count } = await query
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;
          
          return new Response(JSON.stringify({
            orders,
            total: count,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "PUT":
        if (!orderId) {
          throw new Error("Order ID is required for updates");
        }
        
        const updatedOrder = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("orders")
          .update(updatedOrder)
          .eq("id", orderId)
          .select()
          .single();

        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!orderId) {
          throw new Error("Order ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("orders")
          .delete()
          .eq("id", orderId);

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