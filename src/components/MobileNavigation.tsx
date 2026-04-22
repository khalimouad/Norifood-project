import { Home, Package, Info, MessageCircle, User, Phone, LogOut, ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Produits', url: '/products', icon: Package },
  { title: 'À Propos', url: '/about', icon: Info },
  { title: 'Contact', url: '/contact', icon: MessageCircle },
];

interface MobileNavigationProps {
  onClose: () => void;
}

export function MobileNavigation({ onClose }: MobileNavigationProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-bold text-primary">
          Fresh N'Good
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Produits de la mer frais</p>
      </div>

      {/* User Section */}
      {user ? (
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => handleNavigate('/profile')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 active:scale-[0.98] transition-all"
          >
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Mon Compte</p>
              <p className="text-xs text-muted-foreground">Voir le profil</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="p-4 border-b border-border/50">
          <button
            onClick={() => handleNavigate('/auth')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-white font-medium active:scale-[0.98] transition-all shadow-sm"
          >
            <User className="h-4 w-4" />
            Se connecter
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            onClick={() => {
              window.scrollTo(0, 0);
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'text-foreground/80 hover:bg-muted/50 hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-sm">{item.title}</span>
            {({ isActive }) => isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
          </NavLink>
        ))}

        <Separator className="my-4" />

        {/* WhatsApp Contact */}
        <a
          href="https://wa.me/212608611511"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 active:scale-[0.98] transition-all"
        >
          <Phone className="h-5 w-5 shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Contactez-nous</p>
            <p className="text-xs opacity-80">0608 611 511</p>
          </div>
        </a>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-foreground/80">Thème</span>
          <ThemeToggle variant="outline" showLabel={false} className="h-9" />
        </div>

        {user && (
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        )}
      </div>
    </div>
  );
}