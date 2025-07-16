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
    const customerId = url.searchParams.get("id");

    console.log(`[${method}] ${req.url}`);

    switch (method) {
      case "GET":
        if (customerId) {
          // Get single customer with order stats
          const { data: customer, error } = await supabaseClient
            .from("customers")
            .select(`
              *,
              orders (
                id,
                total_amount,
                status,
                created_at
              )
            `)
            .eq("id", customerId)
            .single();

          if (error) throw error;
          
          // Calculate customer stats
          const orders = customer.orders || [];
          const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0) / orders.length : 0,
            lastOrderDate: orders.length > 0 ? orders[0].created_at : null
          };

          return new Response(JSON.stringify({ ...customer, stats }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get all customers with pagination
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const search = url.searchParams.get("search") || "";
          
          let query = supabaseClient
            .from("customers")
            .select(`
              *,
              orders (count)
            `, { count: "exact" })
            .order("created_at", { ascending: false });

          if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
          }

          const { data: customers, error, count } = await query
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;
          
          return new Response(JSON.stringify({
            customers,
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

        let newCustomer;
        try {
          newCustomer = JSON.parse(body);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        const { data: customer, error: createError } = await supabaseClient
          .from("customers")
          .insert([newCustomer])
          .select()
          .single();

        if (createError) {
          console.error('Error creating customer:', createError);
          throw createError;
        }
        
        console.log('Customer created successfully');
        return new Response(JSON.stringify(customer), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        if (!customerId) {
          throw new Error("Customer ID is required for updates");
        }
        
        const updateBody = await req.text();
        console.log('Update body:', updateBody);
        
        if (!updateBody) {
          throw new Error("Request body is required");
        }

        let updatedCustomer;
        try {
          updatedCustomer = JSON.parse(updateBody);
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }

        const { data: updated, error: updateError } = await supabaseClient
          .from("customers")
          .update(updatedCustomer)
          .eq("id", customerId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating customer:', updateError);
          throw updateError;
        }
        
        console.log('Customer updated successfully');
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        if (!customerId) {
          throw new Error("Customer ID is required for deletion");
        }
        
        const { error: deleteError } = await supabaseClient
          .from("customers")
          .delete()
          .eq("id", customerId);

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