import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Check if user is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: adminUser, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting bulk product image update...');

    // Map of product name patterns to image URLs (using real photos from internet)
    const imageMapping = [
      { pattern: 'Burger de poisson', image: '/src/assets/burger-poisson-real.jpg' },
      { pattern: 'Carcasses de crevette', image: '/src/assets/carcasses-crevette.jpg' },
      { pattern: 'Carcasses de poissons', image: '/src/assets/carcasses-poissons.jpg' },
      { pattern: 'Cartes-cadeaux', image: '/src/assets/carte-cadeau.jpg' },
      { pattern: 'Chicken Burger', image: '/src/assets/chicken-burger.jpg' },
      { pattern: 'Chicken Cordon bleu', image: '/src/assets/chicken-cordon-bleu.jpg' },
      { pattern: 'Chicken nuggets', image: '/src/assets/chicken-nuggets.jpg' },
      { pattern: 'Coeur de filet saumon fumé', image: '/src/assets/coeur-saumon-fume.jpg' },
      { pattern: 'Coeur de saumon fumé', image: '/src/assets/coeur-saumon-fume.jpg' },
      { pattern: 'Couteau', image: '/src/assets/clams-real.jpg' },
      { pattern: 'Palourde', image: '/src/assets/clams-real.jpg' },
      { pattern: 'Filet panés', image: '/src/assets/filet-pane.jpg' },
      { pattern: 'Nuggets de poisson', image: '/src/assets/filet-pane.jpg' },
      { pattern: 'Fraises congelées', image: '/src/assets/fraises-congelees-real.jpg' },
      { pattern: 'Mangue Congelées', image: '/src/assets/mangue-congelee-real.jpg' },
      { pattern: 'Saumon Norvège', image: '/src/assets/saumon-norvege.jpg' },
    ];

    // Get all products without images
    const { data: products, error: fetchError } = await supabaseClient
      .from('products')
      .select('id, name, image_url')
      .or('image_url.is.null,image_url.eq.');

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products', details: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${products?.length || 0} products without images`);

    const updates = [];
    const notMatched = [];

    // Match products to images
    for (const product of products || []) {
      let matched = false;
      
      for (const mapping of imageMapping) {
        if (product.name.includes(mapping.pattern)) {
          updates.push({
            id: product.id,
            name: product.name,
            image_url: mapping.image
          });
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        notMatched.push(product.name);
      }
    }

    console.log(`Matched ${updates.length} products to images`);
    console.log(`${notMatched.length} products not matched`);

    // Update products in batches
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({ image_url: update.image_url })
        .eq('id', update.id);

      if (updateError) {
        console.error(`Error updating product ${update.name}:`, updateError);
        errorCount++;
      } else {
        console.log(`Updated: ${update.name} -> ${update.image_url}`);
        successCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated: successCount,
        errors: errorCount,
        notMatched: notMatched.length,
        notMatchedProducts: notMatched,
        message: `Successfully updated ${successCount} products`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in bulk-update-product-images:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
