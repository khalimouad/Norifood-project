import { Home, Package, Info, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

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
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-ocean mb-6">Menu</h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-ocean/10 text-ocean font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}