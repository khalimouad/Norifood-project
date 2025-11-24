import { Home, Grid3X3, ShoppingBag, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { CategoriesSidebar } from '@/components/CategoriesSidebar';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [categoriesSidebarOpen, setCategoriesSidebarOpen] = useState(false);
  
  const navItems = [
    { icon: Home, label: 'Accueil', path: '/', action: 'navigate' },
    { icon: Grid3X3, label: 'Catégories', path: '/products', action: 'categories' },
    { icon: ShoppingBag, label: 'Panier', path: '/cart', badge: getTotalItems(), action: 'navigate' },
    { icon: BookOpen, label: 'Recettes', path: '/recipes', action: 'navigate' },
    { icon: User, label: 'Profil', path: '/profile', action: 'navigate' },
  ];

  const handleItemClick = (item: any) => {
    if (item.action === 'categories') {
      setCategoriesSidebarOpen(true);
    } else {
      window.scrollTo(0, 0);
      navigate(item.path);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom block md:hidden rounded-t-3xl">
        <div className="flex items-center justify-around py-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.action === 'categories' && categoriesSidebarOpen);
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleItemClick(item)}
                className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 relative flex-1 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'text-ocean' 
                    : 'text-gray-500 hover:text-ocean hover:bg-ocean/10'
                }`}
              >
                <div className="relative">
                  <item.icon className="h-4 w-4" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-2 -right-2 bg-coral text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-ocean rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      <CategoriesSidebar 
        open={categoriesSidebarOpen} 
        onOpenChange={setCategoriesSidebarOpen} 
      />
    </>
  );
};