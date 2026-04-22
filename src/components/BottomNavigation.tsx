import { Home, Fish, ShoppingBag, User, UtensilsCrossed } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { CategoriesSidebar } from '@/components/CategoriesSidebar';
import { motion } from 'framer-motion';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [categoriesSidebarOpen, setCategoriesSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/', action: 'navigate' },
    { icon: Fish, label: 'Produits', path: '/products', action: 'navigate' },
    { icon: ShoppingBag, label: 'Panier', path: '/cart', badge: getTotalItems(), action: 'navigate' },
    { icon: UtensilsCrossed, label: 'Recettes', path: '/recipes', action: 'navigate' },
    { icon: User, label: 'Compte', path: '/auth', action: 'navigate' },
  ];

  const handleItemClick = (item: any) => {
    if (item.action === 'categories') {
      setCategoriesSidebarOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(item.path);
    }
  };

  return (
    <>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Floating Mobile App Style Nav */}
        <div className="mx-3 mb-3 bg-white dark:bg-card rounded-3xl shadow-2xl shadow-glovo-purple/15 border border-glovo-purple/10 dark:border-white/5 overflow-hidden backdrop-blur-xl">
          {/* Gradient top line */}
          <div className="h-1 bg-gradient-to-r from-glovo-purple to-glovo-orange"></div>
          
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path || (item.action === 'categories' && categoriesSidebarOpen);
              
              return (
                <motion.button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 ${
                    isActive ? 'flex-[1.2]' : 'flex-1'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-glovo-purple to-glovo-green rounded-2xl shadow-md shadow-glovo-purple/30"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <div className="relative">
                    <item.icon className={`h-5 w-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-white scale-110' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    
                    {/* Badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <motion.span 
                        className="absolute -top-2 -right-2 bg-glovo-orange text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-[10px] font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-white font-bold' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Safe area for iPhone X+ */}
          <div className="h-safe-area-inset-bottom"></div>
        </div>
      </motion.div>

      <CategoriesSidebar
        open={categoriesSidebarOpen}
        onOpenChange={setCategoriesSidebarOpen}
      />
    </>
  );
};