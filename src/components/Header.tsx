import { useState } from 'react';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-ocean"></div>
            <span className="text-2xl font-bold text-ocean">Fresh N'Good</span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-ocean transition-colors font-medium">
              Accueil
            </a>
            <a href="#products" className="text-gray-700 hover:text-ocean transition-colors font-medium">
              Produits
            </a>
            <a href="#categories" className="text-gray-700 hover:text-ocean transition-colors font-medium">
              Catégories
            </a>
            <a href="#recipes" className="text-gray-700 hover:text-ocean transition-colors font-medium">
              Recettes
            </a>
            <a href="#about" className="text-gray-700 hover:text-ocean transition-colors font-medium">
              À Propos
            </a>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher des produits..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-full text-sm focus:ring-2 focus:ring-ocean/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-ocean">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-ocean">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-ocean">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-ocean text-white">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};