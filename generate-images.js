import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'http://46.225.55.151:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cWVjemF5enh1dmV3bmNwYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM0NjUsImV4cCI6MjA2ODE4OTQ2NX0.j_n5rgp75XkDVkl617685i_g4CcVkAv5OyLC7qdtkR8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching products from Supabase...');

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products`);
  console.log('\nSample products:');
  console.log(JSON.stringify(products.slice(0, 5), null, 2));

  // Save to file for processing
  fs.writeFileSync('/tmp/products.json', JSON.stringify(products, null, 2));
  console.log('\nSaved to /tmp/products.json');
}

main().catch(console.error);
