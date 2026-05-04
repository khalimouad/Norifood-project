import { Home, Search, ShoppingBag, User, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Search, label: 'Catalogue', path: '/products' },
  { icon: ShoppingBag, label: 'Panier', path: '/cart', cart: true },
  { icon: User, label: 'Compte', path: '/orders' },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      <div className="bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-stretch px-2">
          {/* 4 plain icons */}
          <div className="grid grid-cols-4 flex-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              const badge = item.cart ? cartCount : 0;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(item.path);
                  }}
                  className="relative flex flex-col items-center justify-center gap-1 py-2.5"
                  aria-label={item.label}
                >
                  <div className="relative">
                    <item.icon
                      className={`h-5 w-5 transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Norifood truck CTA */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/products');
            }}
            className="my-1.5 ml-2 px-3 inline-flex flex-col items-center justify-center gap-0.5 rounded-md bg-primary text-primary-foreground hover:bg-nori-light transition-colors shadow-[0_4px_14px_-2px_hsl(var(--nori-red)/0.5)]"
            aria-label="Commander"
          >
            <Truck className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Norifood</span>
          </button>
        </div>
      </div>
    </div>
  );
};
