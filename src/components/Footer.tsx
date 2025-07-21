import { Fish, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Award, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
export const Footer = () => {
  const [email, setEmail] = useState('');
  const {
    toast
  } = useToast();
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Merci pour votre inscription !",
        description: "Vous recevrez bientôt nos dernières actualités."
      });
      setEmail('');
    }
  };
  return <footer className="text-primary-foreground bg-blue-600">
      {/* Features Section */}
      <div className="border-b border-white/10 bg-blue-700">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start text-center md:text-left">
              <div className="p-2 bg-seafoam/20 rounded-full">
                <Award className="h-5 w-5 md:h-6 md:w-6 text-seafoam" />
              </div>
              <div>
                <h4 className="font-semibold text-xs md:text-sm">Qualité Premium</h4>
                <p className="text-xs text-white/70 hidden md:block">Produits frais sélectionnés</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start text-center md:text-left">
              <div className="p-2 bg-seafoam/20 rounded-full">
                <Truck className="h-5 w-5 md:h-6 md:w-6 text-seafoam" />
              </div>
              <div>
                <h4 className="font-semibold text-xs md:text-sm">Livraison Rapide</h4>
                <p className="text-xs text-white/70 hidden md:block">Livraison en 24h</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start text-center md:text-left">
              <div className="p-2 bg-seafoam/20 rounded-full">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-seafoam" />
              </div>
              <div>
                <h4 className="font-semibold text-xs md:text-sm">Paiement Sécurisé</h4>
                <p className="text-xs text-white/70 hidden md:block">Transaction protégée</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start text-center md:text-left">
              <div className="p-2 bg-seafoam/20 rounded-full">
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6 text-seafoam" />
              </div>
              <div>
                <h4 className="font-semibold text-xs md:text-sm">Fraîcheur Garantie</h4>
                <p className="text-xs text-white/70 hidden md:block">Satisfaction assurée</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4 md:mb-6">
              <Fish className="h-8 w-8 md:h-10 md:w-10 text-seafoam" />
              <span className="text-xl md:text-2xl font-bold">Fresh N'Good</span>
            </div>
            <p className="text-white/80 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Depuis plus de 20 ans, Fresh N'Good vous propose les meilleurs produits de la mer à Marrakech. 
              Notre expertise et notre passion pour la qualité nous permettent de vous garantir 
              fraîcheur et saveur à chaque livraison dans toute la région de Marrakech.
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-seafoam/20 hover:text-seafoam transition-all duration-300">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-seafoam/20 hover:text-seafoam transition-all duration-300">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-seafoam/20 hover:text-seafoam transition-all duration-300">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-seafoam">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-seafoam transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/80 hover:text-seafoam transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Nos Produits</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-seafoam transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">À Propos</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-seafoam transition-colors duration-300 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-seafoam">Nous Contacter</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-seafoam mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">0608 611 511</p>
                  <p className="text-white font-medium">0608 411 511</p>
                  <p className="text-white/60 text-sm">Lun-Ven: 8h-18h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-seafoam mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">contact@freshngood.ma</p>
                  <p className="text-white/60 text-sm">Réponse sous 24h</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-seafoam mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Imm. Assala - 50 Gueliz</p>
                  <p className="text-white font-medium">Bd Mohamed VI</p>
                  <p className="text-white/60 text-sm">Marrakesh 40000, Maroc</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-seafoam mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Horaires d'ouverture</p>
                  <p className="text-white/60 text-sm">Lun-Sam: 6h-20h</p>
                  <p className="text-white/60 text-sm">Dim: 8h-18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-seafoam">Newsletter</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Inscrivez-vous pour recevoir nos dernières actualités, promotions exclusives 
              et conseils de préparation.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input type="email" placeholder="Votre adresse email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 
                         focus:border-seafoam focus:ring-seafoam/20 transition-all duration-300" />
              <Button type="submit" className="w-full bg-gradient-to-r from-seafoam to-seafoam/80 hover:from-seafoam/90 
                         hover:to-seafoam/70 text-white font-semibold py-2.5 transition-all duration-300 
                         transform hover:scale-105">
                S'abonner
              </Button>
            </form>
            <p className="text-white/50 text-xs mt-3">
              Vous pouvez vous désabonner à tout moment.
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-white/20" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p className="text-white/60 text-sm">
              © 2024 Fresh N'Good. Tous droits réservés.
            </p>
            <p className="text-white/40 text-xs">
              Conçu avec ❤️ pour les amateurs de produits frais
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            <Link to="/privacy" className="text-white/60 hover:text-seafoam text-sm transition-colors duration-300">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-seafoam text-sm transition-colors duration-300">
              Conditions d'utilisation
            </Link>
            <Link to="/conditions-de-vente" className="text-white/60 hover:text-seafoam text-sm transition-colors duration-300">
              Conditions de vente
            </Link>
            <Link to="/shipping" className="text-white/60 hover:text-seafoam text-sm transition-colors duration-300">
              Livraison & Retours
            </Link>
            <Link to="/faq" className="text-white/60 hover:text-seafoam text-sm transition-colors duration-300">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};