import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Phone, MapPin, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  slug: string;
  base_price: number;
  unit_type: string;
  description: string | null;
  keywords: string[] | null;
}

export const Header = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const cartCount = getTotalItems();

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const calculateRelevanceScore = (product: Product, searchWords: string[]) => {
    const name = normalizeText(product.name || '');
    const description = normalizeText(product.description || '');
    const keywords = product.keywords || [];
    
    let score = 0;
    
    searchWords.forEach(word => {
      if (word.length < 2) return;
      
      if (name === word) score += 100;
      else if (name.startsWith(word)) score += 80;
      else if (name.split(' ').includes(word)) score += 60;
      else if (word.length >= 3 && name.includes(word)) score += 30;
      
      if (description.split(' ').includes(word)) score += 20;
      
      keywords.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedKeyword === word) score += 70;
        else if (normalizedKeyword.includes(word) && word.length >= 3) score += 40;
      });
    });
    
    return score;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, image_url, slug, base_price, unit_type, description, keywords')
          .eq('is_active', true)
          .limit(100);
        
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products
    .map(product => {
      const searchWords = normalizeText(searchTerm).split(' ').filter(w => w.length > 0);
      const score = calculateRelevanceScore(product, searchWords);
      return { ...product, relevanceScore: score };
    })
    .filter(product => product.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);

  const handleProductClick = (product: Product) => {
    setSearchOpen(false);
    setSearchTerm('');
    navigate(`/product/${product.slug}`);
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Mobile App Style Header */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Location */}
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-glovo-purple to-glovo-orange rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-glovo-purple/20">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              
              <div className="hidden sm:block">
                <Link to="/" className="font-bold text-xl bg-gradient-to-r from-glovo-purple to-glovo-orange bg-clip-text text-transparent">
                  Norifood
                </Link>
              </div>
              
              {/* Location Badge - Desktop */}
              <button className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <MapPin className="h-3.5 w-3.5 text-glovo-purple" />
                <span className="text-gray-700 dark:text-gray-300">Marrakech</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <button 
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Rechercher des produits...</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search - Mobile */}
              <motion.button 
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {/* Phone */}
              <motion.a 
                href="tel:0608611511"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20"
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-4 w-4" />
              </motion.a>

              {/* Cart */}
              <motion.button
                onClick={() => navigate('/cart')}
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-glovo-purple to-glovo-orange text-white shadow-lg shadow-glovo-purple/20"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-glovo-orange text-white text-[10px] font-bold border-2 border-white dark:border-gray-900">
                    {cartCount}
                  </Badge>
                )}
              </motion.button>

              {/* User */}
              {user ? (
                <motion.button
                  onClick={signOut}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Location & Info - Mobile */}
          <div className="md:hidden flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5 text-glovo-purple" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Marrakech</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Livraison en 1-2h</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Rechercher des produits..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          {filteredProducts.length > 0 && (
            <CommandGroup heading="Produits">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleProductClick(product)}
                  className="flex items-center gap-3 p-3"
                >
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.base_price.toFixed(2)} MAD / {product.unit_type}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};