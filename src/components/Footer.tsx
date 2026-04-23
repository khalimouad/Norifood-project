import { Phone, Mail, Instagram, Award, Truck, ShieldCheck, Waves, MessageCircle, Fish } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Footer = () => {
  const trustItems = [
    { icon: Award, label: 'Qualité' },
    { icon: Truck, label: 'Livraison' },
    { icon: ShieldCheck, label: 'Sécurisé' },
    { icon: Waves, label: 'Fraîcheur' },
  ];

  return (
    <footer className="bg-[hsl(var(--footer-dark))] text-white">
      {/* Trust strip — flat vibrant blue */}
      <div className="relative bg-glovo-purple p-4">
        <div className="relative grid grid-cols-4 gap-2">
          {trustItems.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              className="flex flex-col items-center text-white"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center mb-1.5 backdrop-blur-sm ring-1 ring-white/30">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold text-center tracking-wide">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Footer - Mobile App Style */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Contact Section - Mobile First */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-glovo-purple rounded-full flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Commandez par téléphone</p>
              <p className="text-gray-400 text-xs">0608 611 511 • 0608 411 511</p>
            </div>
            <a href="tel:0608611511" className="px-4 py-2 bg-glovo-purple rounded-full text-white text-sm font-medium">
              Appeler
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-glovo-purple rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">WhatsApp</p>
              <p className="text-gray-400 text-xs">Réponse rapide garantie</p>
            </div>
            <a href="https://wa.me/212608611511" className="px-4 py-2 bg-green-500 rounded-full text-white text-sm font-medium">
              Chat
            </a>
          </div>
        </div>

        {/* Quick Links - Mobile App Style */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
          <Link to="/products" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <p className="font-medium text-sm">Nos Produits</p>
            <p className="text-gray-400 text-xs">Poissons & Fruits de mer</p>
          </Link>
          <Link to="/about" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <p className="font-medium text-sm">À Propos</p>
            <p className="text-gray-400 text-xs">Notre histoire</p>
          </Link>
          <Link to="/faq" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <p className="font-medium text-sm">FAQ</p>
            <p className="text-gray-400 text-xs">Questions fréquentes</p>
          </Link>
          <Link to="/contact" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <p className="font-medium text-sm">Contact</p>
            <p className="text-gray-400 text-xs">Nous joindre</p>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-base mb-4 text-glovo-purple">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Accueil</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm">Nos Produits</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">À Propos</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-glovo-purple">Informations</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">Livraison</Link></li>
              <li><Link to="/conditions-de-vente" className="text-gray-400 hover:text-white transition-colors text-sm">Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Confidentialité</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-glovo-purple">Adresse</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Imm. Assala - 50 Gueliz</p>
              <p>Bd Mohamed VI</p>
              <p>Marrakech 40000, Maroc</p>
              <div className="flex items-center gap-2 mt-3">
                <Mail className="h-4 w-4 text-glovo-purple" />
                <span>contact@freshngood.ma</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-base mb-4 text-glovo-purple">Horaires</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Lun - Sam: 6h - 20h</p>
              <p>Dimanche: 8h - 18h</p>
              <p className="text-glovo-purple font-medium mt-3">Livraison 7j/7</p>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-9 h-9 bg-glovo-purple rounded-xl flex items-center justify-center shadow-lg">
              <Fish className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-sm">Fresh N'Good</p>
              <p className="text-white/60 text-xs">© 2024 • Produits de la Mer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://instagram.com" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-glovo-purple transition-all">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-glovo-purple transition-all">
              <span className="text-lg font-bold">f</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};