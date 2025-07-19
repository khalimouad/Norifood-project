import { Home, Package, Info, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
            onClick={() => {
              window.scrollTo(0, 0);
              onClose();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-ocean/10 text-ocean font-medium'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thème</span>
          <ThemeToggle variant="outline" showLabel={false} className="border-gray-200 dark:border-gray-700" />
        </div>
      </div>
    </div>
  );
}