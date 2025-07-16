import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import logo from '@/assets/logo.png';

export const Header = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const cartCount = getTotalItems();

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
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-ocean text-white">{cartCount}</Badge>
              )}
            </Button>
          </div>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Rechercher des produits..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
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
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Rechercher des produits..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-ocean">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-ocean">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-ocean" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-ocean text-white">{cartCount}</Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};