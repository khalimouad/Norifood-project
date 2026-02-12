import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MobileNavigation } from '@/components/MobileNavigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from 'next-themes';
import logoLight from '/lovable-uploads/138d38ef-a9f7-457f-ad50-d38fa1e38e18.png';
import logoDark from '/lovable-uploads/95e558af-028f-4fb7-967a-ccf2a8ae9b54.png';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const cartCount = getTotalItems();

  const currentLogo = theme === 'dark' ? logoDark : logoLight;

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s]/g, '') // Keep only letters, numbers, and spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const calculateRelevanceScore = (product: Product, searchWords: string[]) => {
    const name = normalizeText(product.name || '');
    const description = normalizeText(product.description || '');
    const keywords = product.keywords || [];
    
    let score = 0;
    
    searchWords.forEach(word => {
      if (word.length < 2) return; // Skip single characters
      
      // Exact name match gets highest score
      if (name === word) score += 100;
      // Name starts with search word
      else if (name.startsWith(word)) score += 80;
      // Name contains word at word boundary (exact word match)
      else if (name.split(' ').includes(word)) score += 60;
      // Name contains word but only if it's at least 3 characters to avoid false positives
      else if (word.length >= 3 && name.includes(word)) score += 30;
      
      // Description exact word matches
      if (description.split(' ').includes(word)) score += 20;
      
      // Keywords get high score for exact matches
      keywords.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedKeyword === word) score += 70; // High score for exact keyword match
        else if (normalizedKeyword.includes(word) && word.length >= 3) score += 40; // Partial keyword match
      });
    });
    
    return score;
  };

  // Load products for search
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

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProductSelect = (product: Product) => {
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      window.scrollTo(0, 0);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleNavigate = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
        {/* Mobile Header */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-primary/10 btn-bounce focus-ring">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 glass-card">
                <MobileNavigation onClose={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex-1 flex justify-center" onClick={() => window.scrollTo(0, 0)}>
              <img src={currentLogo} alt="Fresh N'Good" className="h-9 w-auto" />
            </Link>
            
            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle variant="icon" className="hover:bg-muted" />
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-glovo-purple/10 icon-bounce focus-ring"
                onClick={() => handleNavigate('/cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs font-semibold glovo-glow bg-glovo-orange text-white border-2 border-background">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="px-4 pb-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal h-10 glass-card hover-lift focus-ring"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground text-sm truncate">Rechercher...</span>
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="container mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 hover-lift focus-ring" onClick={() => window.scrollTo(0, 0)}>
                <div className="relative">
                  <img src={currentLogo} alt="Fresh N'Good" className="h-10 w-auto" />
                  <Sparkles className="absolute -top-1 -right-2 h-4 w-4 text-primary" />
                </div>
              </Link>
              
              <nav className="hidden lg:flex items-center space-x-1">
                {[
                  { path: '/', label: 'Accueil' },
                  { path: '/products', label: 'Produits' },
                  { path: '/about', label: 'À Propos' },
                  { path: '/contact', label: 'Contact' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className="relative px-4 py-2 text-foreground hover:text-glovo-purple font-medium transition-all duration-300 rounded-xl hover:bg-glovo-purple/10 focus-ring"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex-1 max-w-md mx-8">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal glass-card hover-lift focus-ring py-3 px-4"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Rechercher des produits...</span>
                  <kbd className="ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg bg-muted/80 px-2 font-mono text-[11px] font-medium text-muted-foreground border border-border/40">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <a
                  href="https://wa.me/212608611511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-glovo-green to-emerald-600 hover:from-glovo-green/90 hover:to-emerald-600/90 text-white transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover-lift focus-ring"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">0608 611 511</span>
                </a>

                <ThemeToggle variant="icon" className="text-muted-foreground hover:text-glovo-purple focus-ring" />

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-glovo-purple icon-bounce focus-ring">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="cursor-pointer hover-lift">
                        <User className="mr-2 h-4 w-4" />
                        Mon Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer hover-lift text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleNavigate('/auth')}
                    className="text-muted-foreground hover:text-glovo-purple icon-bounce focus-ring"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-glovo-purple icon-bounce focus-ring"
                  onClick={() => handleNavigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-glovo-orange text-white flex items-center justify-center text-xs font-medium glovo-glow">
                      {cartCount}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Command Dialog with glass-morphism */}
      <CommandDialog 
        open={searchOpen} 
        onOpenChange={(open) => {
          setSearchOpen(open);
          if (!open) setSearchTerm('');
        }}
      >
        <CommandInput 
          placeholder="Rechercher des produits..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.defaultPrevented) {
              const value = e.currentTarget.value;
              handleSearchSubmit(value);
            }
          }}
          className="focus-ring"
        />
        <CommandList className="max-h-[400px] overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          <CommandGroup heading="Produits">
            {(() => {
              // Filter products based on search term using the same logic as Products page
              const filteredProducts = searchTerm ? (() => {
                const normalizedSearchTerm = normalizeText(searchTerm);
                const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 1);
                
                if (searchWords.length === 0) return [];
                
                const productsWithScores = products.map(product => ({
                  product,
                  score: calculateRelevanceScore(product, searchWords)
                })).filter(item => item.score > 0);
                
                productsWithScores.sort((a, b) => {
                  if (b.score !== a.score) return b.score - a.score;
                  return a.product.name.localeCompare(b.product.name);
                });
                
                return productsWithScores.slice(0, 10).map(item => item.product);
              })() : products.slice(0, 10);
              
              return filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.description || ''}`}
                  onSelect={() => handleProductSelect(product)}
                  className="flex items-center gap-3 p-3 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group rounded-xl mx-2 my-1 hover-lift focus-ring"
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex-shrink-0 overflow-hidden shadow-md">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="h-5 w-5 text-muted-foreground group-hover:text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-white truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground group-hover:text-white/80">{product.base_price} MAD/{product.unit_type}</p>
                  </div>
                </CommandItem>
              ));
            })()}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
