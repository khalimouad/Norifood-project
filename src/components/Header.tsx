import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Mobile-first header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-ocean"></div>
            <span className="text-lg font-bold text-ocean">Fresh N'Good</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-coral rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-coral">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des produits..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-full text-sm focus:ring-2 focus:ring-ocean/20 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['Poissons Entiers', 'Filets', 'Crustacés', 'Céphalopodes', 'Fumés'].map((category) => (
            <button
              key={category}
              className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-ocean hover:text-white transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};