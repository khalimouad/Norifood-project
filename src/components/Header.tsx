import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  slug: string;
  base_price: number;
  unit_type: string;
  description: string | null;
}

export const Header = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const cartCount = getTotalItems();

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, image_url, slug, base_price, unit_type, description')
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
    navigate(`/product/${product.id}`);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        {/* Mobile Header */}
        <div className="block md:hidden px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Fresh N'Good" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-coral rounded-full text-xs text-white flex items-center justify-center">2</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-ocean text-white flex items-center justify-center text-xs font-medium">{cartCount}</div>
                )}
              </Button>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal bg-gray-50 border-0"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            Rechercher des produits...
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3">
                <img src={logo} alt="Fresh N'Good" className="h-10 w-auto" />
              </Link>
              <nav className="hidden lg:flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-ocean transition-colors font-medium">Accueil</Link>
                <Link to="/products" className="text-gray-700 hover:text-ocean transition-colors font-medium">Produits</Link>
                <Link to="/about" className="text-gray-700 hover:text-ocean transition-colors font-medium">À Propos</Link>
                <Link to="/contact" className="text-gray-700 hover:text-ocean transition-colors font-medium">Contact</Link>
              </nav>
              <div className="flex-1 max-w-md mx-8">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal bg-gray-50 border-0"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="mr-2 h-4 w-4 text-gray-400" />
                  Rechercher des produits...
                  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-ocean">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Mon Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate('/auth')}
                    className="text-gray-600 hover:text-ocean"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-ocean" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-ocean text-white flex items-center justify-center text-xs font-medium">{cartCount}</div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Rechercher des produits..." 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.defaultPrevented) {
              const value = e.currentTarget.value;
              handleSearchSubmit(value);
            }
          }}
        />
        <CommandList>
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          <CommandGroup heading="Produits">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={`${product.name} ${product.description || ''}`}
                onSelect={() => handleProductSelect(product)}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.base_price} MAD/{product.unit_type}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};