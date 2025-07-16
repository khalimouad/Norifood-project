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
    const paymentId = url.searchParams.get("id");
    const orderId = url.searchParams.get("orderId");

    switch (method) {
      case "GET":
        if (paymentId) {
          // Get single payment transaction
          const { data: payment, error } = await supabaseClient
            .from("payment_transactions")
            .select(`
              *,
              orders (
                id,
                total_amount,
                status,
                customers (first_name, last_name, email)
              )
            `)
            .eq("id", paymentId)
            .single();

          if (error) throw error;
          return new Response(JSON.stringify(payment), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (orderId) {
          // Get payments for specific order
          const { data: payments, error } = await supabaseClient
            .from("payment_transactions")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify(payments), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all payment transactions with pagination
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const status = url.searchParams.get("status") || "";
          const paymentMethod = url.searchParams.get("paymentMethod") || "";
          
          let query = supabaseClient
            .from("payment_transactions")
            .select(`
              *,
              orders (
                id,
                total_amount,
                customers (first_name, last_name, email)
              )
            `, { count: "exact" })
            .order("created_at", { ascending: false });

          if (status) {
            query = query.eq("status", status);
          }
          
          if (paymentMethod) {
            query = query.eq("payment_method", paymentMethod);
          }

          const { data: payments, error, count } = await query
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;
          
          return new Response(JSON.stringify({
            payments,
            total: count,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const newPayment = await req.json();
        const { data: payment, error: createError } = await supabaseClient
          .from("payment_transactions")
          .insert([newPayment])
          .select()
          .single();

        if (createError) throw createError;
        return new Response(JSON.stringify(payment), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!paymentId) {
          throw new Error("Payment ID is required for updates");
        }
        
        const updatedPayment = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from("payment_transactions")
          .update(updatedPayment)
          .eq("id", paymentId)
          .select()
          .single();

        if (updateError) throw updateError;
        
        // If payment status is updated to completed, update order payment status
        if (updatedPayment.status === "completed") {
          await supabaseClient
            .from("orders")
            .update({ payment_status: "completed" })
            .eq("id", updated.order_id);
        }
        
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!paymentId) {
          throw new Error("Payment ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("payment_transactions")
          .delete()
          .eq("id", paymentId);

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