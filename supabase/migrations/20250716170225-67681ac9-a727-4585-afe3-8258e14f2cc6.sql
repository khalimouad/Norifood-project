-- Insert seafood products with proper categorization
INSERT INTO public.products (name, base_price, unit_type, description, is_active, featured, stock_quantity, slug) VALUES
-- Crevettes (Shrimp)
('Puntillas', 0, 'kg', 'Puntillas fraîches de qualité premium', true, false, 10, 'puntillas'),
('Crevette L2', 0, 'units', 'Crevettes L2 fraîches', true, false, 10, 'crevette-l2'),
('Crevettes Décortiquées 50-70', 0, 'kg', 'Crevettes décortiquées 50-70 pièces/kg', true, false, 10, 'crevettes-decortiquees-50-70'),
('Crevettes Grises 50-60 (2Kg)', 148.0, 'units', 'Crevettes grises 50-60 pièces/kg - Pack 2kg', true, true, 10, 'crevettes-grises-50-60-2kg'),
('Crevettes Grises 50-60p/kg', 0, 'kg', 'Crevettes grises 50-60 pièces/kg', true, false, 10, 'crevettes-grises-50-60-kg'),
('Crevettes Grises 60-70 (2Kg)', 140.0, 'units', 'Crevettes grises 60-70 pièces/kg - Pack 2kg', true, true, 10, 'crevettes-grises-60-70-2kg'),
('Crevettes L1', 0, 'units', 'Crevettes L1 fraîches', true, false, 10, 'crevettes-l1'),
('Crevettes Roses Moyennes', 120.0, 'kg', 'Crevettes roses moyennes fraîches', true, true, 10, 'crevettes-roses-moyennes'),
('Crevettes Roses Moyennes décortiquées', 0, 'kg', 'Crevettes roses moyennes décortiquées', true, false, 10, 'crevettes-roses-moyennes-decortiquees'),
('Crevettes grises 20-30 (2kg)', 0, 'units', 'Crevettes grises 20-30 pièces/kg - Pack 2kg', true, false, 10, 'crevettes-grises-20-30-2kg'),
('Crevettes grises 30-40', 0, 'units', 'Crevettes grises 30-40 pièces/kg', true, false, 10, 'crevettes-grises-30-40'),
('Crevettes grises 40-50 (2Kg)', 158.0, 'units', 'Crevettes grises 40-50 pièces/kg - Pack 2kg', true, true, 10, 'crevettes-grises-40-50-2kg'),
('Crevettes roses décortiquées Bloc 1kg', 0, 'units', 'Crevettes roses décortiquées bloc 1kg', true, false, 10, 'crevettes-roses-decortiquees-bloc-1kg'),
('Gambas Tigrées 13-15 p/kg', 0, 'kg', 'Gambas tigrées 13-15 pièces/kg', true, false, 10, 'gambas-tigrees-13-15-kg'),
('Gambas Tigrées 16-20 p/kg', 170.0, 'kg', 'Gambas tigrées 16-20 pièces/kg', true, true, 10, 'gambas-tigrees-16-20-kg'),
('Gambas Tigrées 8-12 p/kg', 245.0, 'kg', 'Gambas tigrées 8-12 pièces/kg - Extra grandes', true, true, 10, 'gambas-tigrees-8-12-kg'),

-- Calamar et Pieuvres (Squid & Octopus)
('Calamar Frais', 0, 'kg', 'Calamar frais de qualité', true, false, 10, 'calamar-frais'),
('Calamar congelé', 130.0, 'kg', 'Calamar congelé', true, true, 10, 'calamar-congele'),
('Calamar nettoyé (Pota)', 77.0, 'kg', 'Calamar nettoyé Pota', true, true, 10, 'calamar-nettoye-pota'),
('Poulpe', 105.0, 'kg', 'Poulpe frais', true, true, 10, 'poulpe'),
('Sepia entier', 81.0, 'kg', 'Sepia entier frais', true, true, 10, 'sepia-entier'),
('Portion de calamar moyen', 0, 'units', 'Portion de calamar moyen', true, false, 10, 'portion-calamar-moyen'),
('Encre de Seiche 2x4g', 12.0, 'units', 'Encre de seiche 2x4g', true, false, 10, 'encre-seiche-2x4g'),

-- Saumon (Salmon)
('Saumon entier 5-6', 144.0, 'kg', 'Saumon entier 5-6 kg', true, true, 10, 'saumon-entier-5-6'),
('Saumon frais entier 4/5', 134.0, 'kg', 'Saumon frais entier 4/5 kg', true, true, 10, 'saumon-frais-entier-4-5'),
('Filet de saumon', 195.0, 'kg', 'Filet de saumon frais', true, true, 10, 'filet-saumon'),
('Pavé de Saumon', 310.0, 'kg', 'Pavé de saumon premium', true, true, 10, 'pave-saumon'),
('Bande Saumon fumé Tranchée', 350.0, 'kg', 'Bande saumon fumé tranchée', true, true, 10, 'bande-saumon-fume-tranchee'),
('Coeur de filet saumon fumé', 0, 'kg', 'Coeur de filet saumon fumé', true, false, 10, 'coeur-filet-saumon-fume'),
('Coeur de saumon fumé 250g', 0, 'units', 'Coeur de saumon fumé 250g', true, false, 10, 'coeur-saumon-fume-250g'),
('Miettes de saumon fumées 500g', 0, 'units', 'Miettes de saumon fumées 500g', true, false, 10, 'miettes-saumon-fumees-500g'),
('Plaquette de saumon fumé', 83.0, 'units', 'Plaquette de saumon fumé', true, true, 10, 'plaquette-saumon-fume'),
('Saumon frais 2/3', 0, 'units', 'Saumon frais 2/3', true, false, 10, 'saumon-frais-2-3'),

-- Daurade (Sea Bream)
('Daurade 400-600', 0, 'kg', 'Daurade 400-600g', true, false, 10, 'daurade-400-600'),
('Daurade 600-800', 0, 'kg', 'Daurade 600-800g', true, false, 10, 'daurade-600-800'),
('Daurade Royale Sauvage', 0, 'kg', 'Daurade royale sauvage', true, false, 10, 'daurade-royale-sauvage'),
('Daurade entier 800-1000', 0, 'kg', 'Daurade entier 800-1000g', true, false, 10, 'daurade-entier-800-1000'),
('Filet de Daurade Grise "IQF"', 49.0, 'kg', 'Filet de daurade grise IQF', true, true, 10, 'filet-daurade-grise-iqf'),
('Filet de Daurade Royal "IQF"', 0, 'kg', 'Filet de daurade royal IQF', true, false, 10, 'filet-daurade-royal-iqf'),

-- Loup Bar (Sea Bass)
('Loup Bar 400-600', 0, 'kg', 'Loup bar 400-600g', true, false, 10, 'loup-bar-400-600'),
('Loup Bar 600-800', 0, 'kg', 'Loup bar 600-800g', true, false, 10, 'loup-bar-600-800'),
('Loup Bar sauvage', 0, 'kg', 'Loup bar sauvage', true, false, 10, 'loup-bar-sauvage'),
('Loup bar entier 800-1000', 0, 'kg', 'Loup bar entier 800-1000g', true, false, 10, 'loup-bar-entier-800-1000'),
('Filet de Loup bar "IQF"', 0, 'kg', 'Filet de loup bar IQF', true, false, 10, 'filet-loup-bar-iqf'),

-- Merlan (Whiting)
('Merlan Friture', 48.0, 'kg', 'Merlan friture', true, true, 10, 'merlan-friture'),
('Merlan HGT', 61.0, 'kg', 'Merlan HGT', true, true, 10, 'merlan-hgt'),
('Merlan colin (frais)', 0, 'kg', 'Merlan colin frais', true, false, 10, 'merlan-colin-frais'),
('Filet de Merlan Congelé', 69.0, 'kg', 'Filet de merlan congelé', true, true, 10, 'filet-merlan-congele'),
('Filet de Merlan frais', 0, 'kg', 'Filet de merlan frais', true, false, 10, 'filet-merlan-frais'),
('Portion filet de merlan', 0, 'units', 'Portion filet de merlan', true, false, 10, 'portion-filet-merlan'),
('Portion filet de merlan colin', 0, 'units', 'Portion filet de merlan colin', true, false, 10, 'portion-filet-merlan-colin'),

-- Thon (Tuna)
('Thon', 0, 'kg', 'Thon frais', true, false, 10, 'thon'),
('Filet de Thon Rouge', 0, 'kg', 'Filet de thon rouge', true, false, 10, 'filet-thon-rouge'),
('Portion pavé de thon rouge', 0, 'units', 'Portion pavé de thon rouge', true, false, 10, 'portion-pave-thon-rouge'),

-- Autres Poissons (Other Fish)
('Espadon', 0, 'kg', 'Espadon frais', true, false, 10, 'espadon'),
('Espadon nettoyé', 0, 'kg', 'Espadon nettoyé', true, false, 10, 'espadon-nettoye'),
('Turbot', 0, 'kg', 'Turbot frais', true, false, 10, 'turbot'),
('Saint pierre Entier', 76.0, 'kg', 'Saint pierre entier', true, true, 10, 'saint-pierre-entier'),
('Filet de Saint pierre', 87.0, 'kg', 'Filet de saint pierre', true, true, 10, 'filet-saint-pierre'),
('Filet de Saint pierre argenté', 0, 'kg', 'Filet de saint pierre argenté', true, false, 10, 'filet-saint-pierre-argente'),
('Sole Tigrée', 97.0, 'kg', 'Sole tigrée', true, true, 10, 'sole-tigree'),
('Sole bouclée', 0, 'kg', 'Sole bouclée', true, false, 10, 'sole-bouclee'),
('Sole noire (M) lenguado', 0, 'kg', 'Sole noire lenguado', true, false, 10, 'sole-noire-lenguado'),
('Rouget friture', 65.0, 'kg', 'Rouget friture', true, true, 10, 'rouget-friture'),
('Ombrine', 0, 'kg', 'Ombrine fraîche', true, false, 10, 'ombrine'),
('Ombrinette', 110.0, 'kg', 'Ombrinette fraîche', true, true, 10, 'ombrinette'),
('Mostelle frais', 0, 'kg', 'Mostelle frais', true, false, 10, 'mostelle-frais'),
('Sardines frais', 0, 'kg', 'Sardines fraîches', true, false, 10, 'sardines-frais'),
('Filet de sardine nature', 0, 'kg', 'Filet de sardine nature', true, false, 10, 'filet-sardine-nature'),
('VH de sardines', 0, 'kg', 'VH de sardines', true, false, 10, 'vh-sardines'),
('Couteau', 0, 'kg', 'Couteau frais', true, false, 10, 'couteau'),

-- Filets spéciaux (Special Fillets)
('Filet de Lotte', 0, 'kg', 'Filet de lotte', true, false, 10, 'filet-lotte'),
('Filet d''Abadèche', 67.0, 'kg', 'Filet d''abadèche', true, true, 10, 'filet-abadeche'),
('Filet de Panga', 53.0, 'kg', 'Filet de panga', true, true, 10, 'filet-panga'),
('Filet de Rascasse Blanche', 69.0, 'kg', 'Filet de rascasse blanche', true, true, 10, 'filet-rascasse-blanche'),
('Portion filet de sar', 0, 'units', 'Portion filet de sar', true, false, 10, 'portion-filet-sar'),

-- Lotte (Monkfish)
('Lotte entier Frais', 0, 'kg', 'Lotte entier frais', true, false, 10, 'lotte-entier-frais'),
('Portion brochettes de lotte', 0, 'units', 'Portion brochettes de lotte', true, false, 10, 'portion-brochettes-lotte'),

-- Darnes et Portions (Steaks and Portions)
('Darnes de Requin "SP"', 69.0, 'kg', 'Darnes de requin SP', true, true, 10, 'darnes-requin-sp'),
('Portion ailes de raie', 0, 'units', 'Portion ailes de raie', true, false, 10, 'portion-ailes-raie'),
('Portion darnes d''ombrine', 0, 'units', 'Portion darnes d''ombrine', true, false, 10, 'portion-darnes-ombrine'),
('Portion darnes de congre', 0, 'units', 'Portion darnes de congre', true, false, 10, 'portion-darnes-congre'),
('Portion darnes de sabre', 0, 'units', 'Portion darnes de sabre', true, false, 10, 'portion-darnes-sabre'),

-- Crustacés (Shellfish)
('Homard', 0, 'kg', 'Homard frais', true, false, 10, 'homard'),
('Langouste', 350.0, 'kg', 'Langouste fraîche', true, true, 10, 'langouste'),
('Chair de crabe -500g-', 0, 'units', 'Chair de crabe 500g', true, false, 10, 'chair-crabe-500g'),
('Pince Pané Crabe', 0, 'kg', 'Pince pané crabe', true, false, 10, 'pince-pane-crabe'),
('Carcasses de crevette', 0, 'kg', 'Carcasses de crevette', true, false, 10, 'carcasses-crevette'),

-- Mollusques (Mollusks)
('Moules Décortiquées', 0, 'kg', 'Moules décortiquées', true, false, 10, 'moules-decortiquees'),
('Moules entiers frais', 0, 'kg', 'Moules entiers frais', true, false, 10, 'moules-entiers-frais'),
('Paloudre frais', 0, 'kg', 'Paloudre frais', true, false, 10, 'paloudre-frais'),
('Palourde précuite (E)', 80.0, 'kg', 'Palourde précuite', true, true, 10, 'palourde-precuite'),
('Palourdes Frais', 0, 'kg', 'Palourdes frais', true, false, 10, 'palourdes-frais'),
('Noix de St-Jacques Sans Corail USA', 0, 'kg', 'Noix de St-Jacques sans corail USA', true, false, 10, 'noix-st-jacques-sans-corail-usa'),
('Huitres', 0, 'units', 'Huitres fraîches', true, false, 10, 'huitres'),

-- Produits Transformés (Processed Products)
('Burger de poisson 1kg', 0, 'kg', 'Burger de poisson 1kg', true, false, 10, 'burger-poisson-1kg'),
('Chicken Burger 1Kg', 0, 'kg', 'Chicken Burger 1kg', true, false, 10, 'chicken-burger-1kg'),
('Chicken Cordon bleu 1Kg', 0, 'kg', 'Chicken Cordon bleu 1kg', true, false, 10, 'chicken-cordon-bleu-1kg'),
('Chicken nuggets 1Kg', 70.0, 'kg', 'Chicken nuggets 1kg', true, true, 10, 'chicken-nuggets-1kg'),
('Nuggets de poisson 1kg', 0, 'kg', 'Nuggets de poisson 1kg', true, false, 10, 'nuggets-poisson-1kg'),
('Surimi 1Kg', 0, 'kg', 'Surimi 1kg', true, false, 10, 'surimi-1kg'),
('Poissons friture', 0, 'kg', 'Poissons friture', true, false, 10, 'poissons-friture'),
('Portion de crevettes décortiquées marocains', 0, 'units', 'Portion de crevettes décortiquées marocains', true, false, 10, 'portion-crevettes-decortiquees-marocains'),
('Portion viande hachée de poisson blanc', 0, 'units', 'Portion viande hachée de poisson blanc', true, false, 10, 'portion-viande-hachee-poisson-blanc'),

-- Fruits Congelés (Frozen Fruits)
('Ananas Congelées', 0, 'kg', 'Ananas congelées', true, false, 10, 'ananas-congelees'),
('Fraises Congelées', 27.0, 'kg', 'Fraises congelées', true, true, 10, 'fraises-congelees'),
('Framboises Congelées', 56.0, 'kg', 'Framboises congelées', true, true, 10, 'framboises-congelees'),
('Mangue Congelées', 0, 'kg', 'Mangue congelées', true, false, 10, 'mangue-congelees'),
('Myrtilles Congelées', 60.0, 'kg', 'Myrtilles congelées', true, true, 10, 'myrtilles-congelees'),
('Mûres congelées', 50.5, 'kg', 'Mûres congelées', true, true, 10, 'mures-congelees'),
('Kaki congelées', 0, 'kg', 'Kaki congelées', true, false, 10, 'kaki-congelees'),

-- Raviolis (Ravioli)
('Ravioli 4 Fromages', 140.0, 'kg', 'Ravioli 4 fromages', true, true, 10, 'ravioli-4-fromages'),
('Ravioli Bolognaise', 0, 'units', 'Ravioli bolognaise', true, false, 10, 'ravioli-bolognaise'),
('Ravioli Cèpes Champignons', 186.0, 'kg', 'Ravioli cèpes champignons', true, true, 10, 'ravioli-cepes-champignons'),
('Ravioli Fruits de Mer', 156.0, 'kg', 'Ravioli fruits de mer', true, true, 10, 'ravioli-fruits-mer'),
('Ravioli Riccota Epinards', 142.0, 'kg', 'Ravioli riccota épinards', true, true, 10, 'ravioli-riccota-epinards'),
('Ravioli Saumon', 180.0, 'kg', 'Ravioli saumon', true, true, 10, 'ravioli-saumon'),
('Ravioli riccota parmesan', 0, 'kg', 'Ravioli riccota parmesan', true, false, 10, 'ravioli-riccota-parmesan'),

-- Pâtes et Autres (Pasta and Others)
('Spaguetti Nature', 58.0, 'kg', 'Spaguetti nature', true, true, 10, 'spaguetti-nature'),
('Sachet de frites 7/7 congelées', 59.0, 'units', 'Sachet de frites 7/7 congelées', true, true, 10, 'sachet-frites-7-7-congelees'),
('Sachet de frites 9/9 - 2,5Kg', 60.0, 'units', 'Sachet de frites 9/9 - 2,5kg', true, true, 10, 'sachet-frites-9-9-2-5kg'),
('Spring Roll', 0, 'units', 'Spring roll', true, false, 10, 'spring-roll'),

-- Autres Produits (Other Products)
('Anchois', 0, 'kg', 'Anchois frais', true, false, 10, 'anchois'),
('Carcasses de poissons', 0, 'kg', 'Carcasses de poissons', true, false, 10, 'carcasses-poissons'),
('Oeuf de poisson', 0, 'units', 'Oeuf de poisson', true, false, 10, 'oeuf-poisson'),

-- Accessoires (Accessories)
('Cartes-cadeaux', 55.0, 'units', 'Cartes-cadeaux', true, false, 10, 'cartes-cadeaux'),
('Sac congélation', 0, 'units', 'Sac congélation', true, false, 10, 'sac-congelation'),
('Sac 🛍', 0, 'units', 'Sac', true, false, 10, 'sac'),
('Reliquat', 1.0, 'units', 'Reliquat', true, false, 10, 'reliquat');