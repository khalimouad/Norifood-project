import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Bell, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
}

export const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const cartCount = getTotalItems();

  // Load products for suggestions
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, image_url, slug, base_price, unit_type')
          .eq('is_active', true)
          .limit(50);
        
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(normalizedSearchTerm)
      ).slice(0, 5);
      
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm, products]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
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
        <div ref={searchRef} className="relative">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Rechercher des produits..." 
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
          
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchSuggestions.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                  style={{ animationDelay: `${index * 50}ms` }}
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
                </button>
              ))}
            </div>
          )}
        </div>
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
            <div ref={searchRef} className="flex-1 max-w-md mx-8 relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Rechercher des produits..." 
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border-0 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                      style={{ animationDelay: `${index * 50}ms` }}
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
                    </button>
                  ))}
                </div>
              )}
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
  );
};