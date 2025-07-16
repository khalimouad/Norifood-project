-- Update products with generated images
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'filet-saumon';
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'pave-saumon';
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'saumon-entier-5-6';
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'saumon-frais-entier-4-5';
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'bande-saumon-fume-tranchee';
UPDATE public.products SET image_url = '/src/assets/filet-saumon.jpg' WHERE slug = 'plaquette-saumon-fume';

UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'gambas-tigrees-8-12-kg';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'gambas-tigrees-16-20-kg';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'gambas-tigrees-13-15-kg';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'crevettes-roses-moyennes';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'crevettes-grises-50-60-2kg';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'crevettes-grises-60-70-2kg';
UPDATE public.products SET image_url = '/src/assets/gambas-tigrees.jpg' WHERE slug = 'crevettes-grises-40-50-2kg';

UPDATE public.products SET image_url = '/src/assets/poulpe.jpg' WHERE slug = 'poulpe';
UPDATE public.products SET image_url = '/src/assets/poulpe.jpg' WHERE slug = 'sepia-entier';

UPDATE public.products SET image_url = '/src/assets/langouste.jpg' WHERE slug = 'langouste';
UPDATE public.products SET image_url = '/src/assets/langouste.jpg' WHERE slug = 'homard';

UPDATE public.products SET image_url = '/src/assets/daurade.jpg' WHERE slug = 'daurade-400-600';
UPDATE public.products SET image_url = '/src/assets/daurade.jpg' WHERE slug = 'daurade-600-800';
UPDATE public.products SET image_url = '/src/assets/daurade.jpg' WHERE slug = 'daurade-royale-sauvage';
UPDATE public.products SET image_url = '/src/assets/daurade.jpg' WHERE slug = 'daurade-entier-800-1000';
UPDATE public.products SET image_url = '/src/assets/daurade.jpg' WHERE slug = 'filet-daurade-grise-iqf';

UPDATE public.products SET image_url = '/src/assets/fraises-congelees.jpg' WHERE slug = 'fraises-congelees';
UPDATE public.products SET image_url = '/src/assets/fraises-congelees.jpg' WHERE slug = 'framboises-congelees';
UPDATE public.products SET image_url = '/src/assets/fraises-congelees.jpg' WHERE slug = 'myrtilles-congelees';
UPDATE public.products SET image_url = '/src/assets/fraises-congelees.jpg' WHERE slug = 'mures-congelees';

UPDATE public.products SET image_url = '/src/assets/ravioli-saumon.jpg' WHERE slug = 'ravioli-saumon';
UPDATE public.products SET image_url = '/src/assets/ravioli-saumon.jpg' WHERE slug = 'ravioli-fruits-mer';
UPDATE public.products SET image_url = '/src/assets/ravioli-saumon.jpg' WHERE slug = 'ravioli-4-fromages';
UPDATE public.products SET image_url = '/src/assets/ravioli-saumon.jpg' WHERE slug = 'ravioli-cepes-champignons';
UPDATE public.products SET image_url = '/src/assets/ravioli-saumon.jpg' WHERE slug = 'ravioli-riccota-epinards';

UPDATE public.products SET image_url = '/src/assets/calamar.jpg' WHERE slug = 'calamar-frais';
UPDATE public.products SET image_url = '/src/assets/calamar.jpg' WHERE slug = 'calamar-congele';
UPDATE public.products SET image_url = '/src/assets/calamar.jpg' WHERE slug = 'calamar-nettoye-pota';

-- Use existing assets for other products
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'loup-bar-400-600';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'loup-bar-600-800';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'loup-bar-entier-800-1000';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'saint-pierre-entier';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'sole-tigree';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'turbot';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'rouget-friture';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'merlan-friture';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'merlan-hgt';
UPDATE public.products SET image_url = '/src/assets/whole-fish.jpg' WHERE slug = 'ombrinette';

UPDATE public.products SET image_url = '/src/assets/shrimp.jpg' WHERE slug = 'crevette-l2';
UPDATE public.products SET image_url = '/src/assets/shrimp.jpg' WHERE slug = 'crevettes-l1';
UPDATE public.products SET image_url = '/src/assets/shrimp.jpg' WHERE slug = 'crevettes-decortiquees-50-70';
UPDATE public.products SET image_url = '/src/assets/shrimp.jpg' WHERE slug = 'crevettes-roses-moyennes-decortiquees';

-- Set some products as featured for better visibility
UPDATE public.products SET featured = true WHERE slug IN (
  'filet-saumon',
  'gambas-tigrees-8-12-kg',
  'poulpe',
  'langouste',
  'daurade-royale-sauvage',
  'ravioli-saumon',
  'calamar-nettoye-pota',
  'saint-pierre-entier',
  'sole-tigree',
  'fraises-congelees',
  'myrtilles-congelees'
);