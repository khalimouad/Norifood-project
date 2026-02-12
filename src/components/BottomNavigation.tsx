import { Home, Search, ShoppingBag, User, Utensils } from 'lucide-react';
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
    { icon: Search, label: 'Recherche', path: '/products', action: 'navigate' },
    { icon: ShoppingBag, label: 'Panier', path: '/cart', badge: getTotalItems(), action: 'navigate' },
    { icon: Utensils, label: 'Recettes', path: '/recipes', action: 'navigate' },
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass safe-area-bottom block md:hidden rounded-t-3xl">
        {/* Glow effect at the top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-glovo-purple to-transparent rounded-full opacity-50"></div>

        <div className="flex items-center justify-around py-2 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.action === 'categories' && categoriesSidebarOpen);
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleItemClick(item)}
                className={`flex flex-col items-center gap-1 h-auto py-3 px-4 relative flex-1 rounded-2xl transition-all duration-300 button-press focus-ring ${
                  isActive
                    ? 'text-white bg-gradient-to-br from-glovo-purple to-glovo-orange shadow-glovo'
                    : 'text-muted-foreground hover:text-glovo-purple hover:bg-glovo-purple/5'
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-glovo-orange to-glovo-pink text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-lg glovo-glow">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full shadow-sm"></div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Safe area for iPhone X+ */}
        <div className="safe-area-bottom h-0"></div>
      </div>

      <CategoriesSidebar
        open={categoriesSidebarOpen}
        onOpenChange={setCategoriesSidebarOpen}
      />
    </>
  );
};
