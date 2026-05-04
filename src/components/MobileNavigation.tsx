import { Home, Package, Info, MessageCircle, User, Phone, LogOut, ChevronRight, Utensils, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { NorifoodLogo } from '@/components/NorifoodLogo';

const menuItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Catalogue', url: '/products', icon: Package },
  { title: 'Recettes', url: '/recipes', icon: Utensils },
  { title: 'À propos', url: '/about', icon: Info },
  { title: 'Contact', url: '/contact', icon: MessageCircle },
  { title: 'FAQ', url: '/faq', icon: HelpCircle },
];

interface MobileNavigationProps {
  onClose: () => void;
}

export function MobileNavigation({ onClose }: MobileNavigationProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-5 border-b border-border">
        <NorifoodLogo size="md" showTagline />
      </div>

      {user ? (
        <div className="p-4 border-b border-border">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">Mon compte</p>
              <p className="text-xs text-muted-foreground">Voir le profil</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </NavLink>
        </div>
      ) : (
        <div className="p-4 border-b border-border">
          <NavLink
            to="/auth"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wide text-sm hover:bg-nori-light transition-colors"
          >
            <User className="h-4 w-4" />
            Se connecter
          </NavLink>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-sm">{item.title}</span>
          </NavLink>
        ))}

        <Separator className="my-3 bg-border" />

        <a
          href="https://wa.me/212608611511"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-md bg-secondary hover:bg-primary/10 transition-colors"
        >
          <Phone className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">Contactez-nous</p>
            <p className="text-xs text-muted-foreground">0608 611 511</p>
          </div>
        </a>
      </nav>

      {user && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => { signOut(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-md text-foreground/80 hover:text-primary hover:bg-secondary transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
