import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NorifoodLogo } from '@/components/NorifoodLogo';

export const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border mt-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-4">
            <NorifoodLogo size="lg" showTagline />
            <p className="text-sm text-muted-foreground max-w-sm">
              Le partenaire des restaurants pour des ingrédients asiatiques, sushi
              et surgelés de qualité. Livraison rapide, sélection premium.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/212608611511"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Catalogue */}
          <div className="lg:col-span-2">
            <h3 className="nori-section-title mb-4">Catalogue</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Tous les produits</Link></li>
              <li><Link to="/products?category=sushi" className="text-muted-foreground hover:text-primary transition-colors">Sushi</Link></li>
              <li><Link to="/products?category=surgeles" className="text-muted-foreground hover:text-primary transition-colors">Surgelés</Link></li>
              <li><Link to="/products?category=epicerie" className="text-muted-foreground hover:text-primary transition-colors">Épicerie</Link></li>
              <li><Link to="/recipes" className="text-muted-foreground hover:text-primary transition-colors">Recettes</Link></li>
            </ul>
          </div>

          {/* Infos */}
          <div className="lg:col-span-2">
            <h3 className="nori-section-title mb-4">Informations</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Livraison</Link></li>
              <li><Link to="/conditions-de-vente" className="text-muted-foreground hover:text-primary transition-colors">Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="nori-section-title mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Imm. Assala – 50 Gueliz, Bd Mohamed VI, Marrakech 40000, Maroc</span>
              </div>
              <a href="tel:0608611511" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                0608 611 511 · 0608 411 511
              </a>
              <a href="mailto:contact@norifood.ma" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                contact@norifood.ma
              </a>
            </div>

            <div className="mt-5 inline-flex flex-col gap-1 px-4 py-3 rounded-md bg-card border border-border">
              <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
                Horaires
              </span>
              <span className="text-sm text-foreground">Lun – Sam : 6h – 20h</span>
              <span className="text-sm text-foreground">Dimanche : 8h – 18h</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Norifood SARL. Tous droits réservés.</p>
          <p className="uppercase tracking-[0.2em]">Frozen · Asian · Sushi</p>
        </div>
      </div>
    </footer>
  );
};
