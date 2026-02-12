#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://46.225.55.151:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY5ODgyMDM1LCJleHAiOjIwODUyNDIwMzV9.RVYQxSMDhwLr2vrJIxQUqQOKCNOvsW32EET2ZXl6GMA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Unsplash images for seafood products
const imageMapping = {
  // Crab products
  'Chair de crabe': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop&q=60',
  'Pince Pané Crabe': 'https://images.unsplash.com/photo-1599021309830-7361d952368c?w=800&auto=format&fit=crop&q=60',

  // Squid/Calamari
  'Encre de Seiche': 'https://images.unsplash.com/photo-1599313850494-fec6666d8681?w=800&auto=format&fit=crop&q=60',
  'Sepia entier': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60',
  'Portion de calamar': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=60',
  'Calamar': 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&auto=format&fit=crop&q=60',
  'Calmars': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=60',

  // Shrimp/Prawns
  'Crevettes Décortiquées': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60',
  'Crevettes Grises': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=60',
  'Crevettes Roses': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=60',
  'Gambas': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=60',
  'Gambas Tigrées': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=60',
  'Langouste': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop&q=60',
  'Langoustine': 'https://images.unsplash.com/photo-1535583409868-1de27c2e01f7?w=800&auto=format&fit=crop&q=60',
  'Crevette': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=60',

  // Salmon
  'Saumon': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&auto=format&fit=crop&q=60',
  'Filet de saumon': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&auto=format&fit=crop&q=60',
  'Bande Saumon fumé': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&auto=format&fit=crop&q=60',
  'Saumon fumé': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&auto=format&fit=crop&q=60',
  'Miettes de saumon': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&auto=format&fit=crop&q=60',

  // Tuna
  'Thon': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&auto=format&fit=crop&q=60',
  'Thon Rouge': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&auto=format&fit=crop&q=60',
  'Filet de Thon': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&auto=format&fit=crop&q=60',

  // Fish - Whole
  'Daurade': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Loup Bar': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Bar': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Sole': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Sole Tigrée': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Merlan': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Merlan Friture': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Ombrine': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Maquereau': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Sardine': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',

  // Fish - Fillets
  'Filet de Daurade': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Filet de Daurade Royal': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Filet de Rascasse': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Filet': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',

  // Shellfish
  'Huitres': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60',
  'Palourde': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&auto=format&fit=crop&q=60',
  'Palourde précuite': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&auto=format&fit=crop&q=60',
  'Moules': 'https://images.unsplash.com/photo-1623689046286-01aae51214e4?w=800&auto=format&fit=crop&q=60',
  'Coquilles': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60',

  // Octopus/Cuttlefish
  'Poulpe': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop&q=60',
  'Octopus': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&auto=format&fit=crop&q=60',
  'Seiche': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=60',

  // Anchovy/Sardine
  'Anchois': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',
  'Sardines': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',

  // Shark/Ray
  'Requin': 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&auto=format&fit=crop&q=60',
  'Darnes de Requin': 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&auto=format&fit=crop&q=60',

  // Couteau (Razor clam)
  'Couteau': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&auto=format&fit=crop&q=60',

  // Swordfish
  'Darnes de sabre': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&auto=format&fit=crop&q=60',

  // Chicken products
  'Chicken Cordon bleu': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=60',
  'Chicken nuggets': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&auto=format&fit=crop&q=60',
  'Chicken Burger': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=60',
  'Burger de poulet': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=60',

  // Fish burger
  'Burger de poisson': 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&auto=format&fit=crop&q=60',

  // Ravioli/Pasta
  'Ravioli': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60',
  'Ravioli Riccota Epinards': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60',
  'Ravioli 4 Fromages': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60',
  'Ravioli Saumon': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60',
  'Ravioli Cèpes': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60',

  // Spaghetti
  'Spaguetti': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=60',
  'Spaguetti Nature': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=60',

  // Spring roll
  'Spring Roll': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=60',

  // Frozen items
  'Mangue Congelées': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=60',

  // Supplies
  'Sac congélation': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=60',

  // Fish carcasses
  'Carcasses de poissons': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60',

  // Canned items
  'Encre': 'https://images.unsplash.com/photo-1599313850494-fec6666d8681?w=800&auto=format&fit=crop&q=60',

  // Default fish image
  'default': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=60'
};

function findImageForProduct(name) {
  const lowerName = name.toLowerCase();

  for (const [key, url] of Object.entries(imageMapping)) {
    if (key.toLowerCase() === 'default') continue;
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName.split(' ')[0])) {
      return url;
    }
  }

  return imageMapping['default'];
}

async function main() {
  console.log('Fetching products without images...');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .or('image_url.is.null,image_url.eq.,image_url.like./src/%');

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products needing images`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const newImage = findImageForProduct(product.name);

    console.log(`\nProduct: ${product.name}`);
    console.log(`Current: ${product.image_url || 'null'}`);
    console.log(`New: ${newImage}`);

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: newImage })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  ❌ Error updating: ${updateError.message}`);
    } else {
      console.log(`  ✅ Updated`);
      updated++;
    }
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`Total products checked: ${products.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch(console.error);
