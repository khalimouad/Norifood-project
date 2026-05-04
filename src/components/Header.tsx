import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Phone, MapPin, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { NorifoodLogo } from '@/components/NorifoodLogo';
import { MobileNavigation } from '@/components/MobileNavigation';
import { formatPrice } from '@/lib/format';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  slug: string;
  base_price: number;
  unit_type: string;
  description: string | null;
  keywords: string[] | null;
}

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/products', label: 'Catégories' },
  { to: '/products?featured=1', label: 'Best-sellers' },
  { to: '/recipes', label: 'Recettes' },
  { to: '/about', label: 'À propos' },
];

export const Header = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();
  const cartCount = getTotalItems();

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, image_url, slug, base_price, unit_type, description, keywords')
          .eq('is_active', true)
          .limit(100);
        if (data) setProducts(data);
      } catch (e) {
        console.error('Error loading products:', e);
      }
    })();
  }, []);

  const filteredProducts = (() => {
    if (!searchTerm.trim()) return [];
    const q = normalize(searchTerm);
    return products
      .filter((p) => normalize(p.name).includes(q))
      .slice(0, 8);
  })();

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-black border-b border-border/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs text-muted-foreground">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" />
                Livraison Marrakech
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-primary" />
                0608 611 511
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/about" className="hover:text-foreground transition-colors">À propos</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 h-16 md:h-20">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] max-w-xs p-0 bg-background border-border">
                <MobileNavigation onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="shrink-0">
              <NorifoodLogo size="md" showTagline={false} />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                      isActive ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-md bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors text-sm w-48 lg:w-64"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher un produit…</span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User */}
            {user ? (
              <button
                onClick={signOut}
                className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-md hover:bg-secondary transition-colors"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-md hover:bg-secondary transition-colors"
                aria-label="Mon compte"
              >
                <User className="h-5 w-5" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative inline-flex items-center gap-2 h-10 px-3 rounded-md bg-primary text-primary-foreground hover:bg-nori-light transition-colors font-semibold text-sm shadow-[0_4px_14px_-2px_hsl(var(--nori-red)/0.4)]"
              aria-label="Panier"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Panier</span>
              {cartCount > 0 && (
                <Badge className="ml-1 h-5 min-w-5 px-1.5 bg-black text-white text-[10px] font-bold border-0">
                  {cartCount}
                </Badge>
              )}
            </button>
          </div>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Rechercher un produit…"
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          {filteredProducts.length > 0 && (
            <CommandGroup heading="Produits">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => {
                    setSearchOpen(false);
                    setSearchTerm('');
                    navigate(`/product/${product.slug}`);
                  }}
                  className="flex items-center gap-3 p-3"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.base_price)} MAD / {product.unit_type}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
