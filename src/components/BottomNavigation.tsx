import { Home, Grid3X3, ShoppingBag, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: 'Accueil', active: true },
    { icon: Grid3X3, label: 'Catégories', active: false },
    { icon: ShoppingBag, label: 'Panier', active: false, badge: 2 },
    { icon: Heart, label: 'Favoris', active: false },
    { icon: User, label: 'Profil', active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom block md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={`flex flex-col items-center gap-1 h-auto py-3 px-2 relative flex-1 ${
              item.active 
                ? 'text-ocean' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
            {item.active && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-ocean rounded-full"></div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};