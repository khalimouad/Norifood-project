import { Button } from '@/components/ui/button';
import { ArrowRight, Fish, Truck, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-seafood.jpg';

export const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-wave">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh seafood display"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean/80 to-ocean-light/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Produits de la Mer
            <span className="block text-seafoam">Frais Quotidiennement</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Poissons et fruits de mer de qualité premium, de l'océan à votre table.
            Choisissez par poids, unité ou pièce avec fraîcheur garantie.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-coral hover:bg-coral/90 text-white shadow-float">
              Commander
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Voir le Menu
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-seafoam/20 p-3 rounded-full">
                <Fish className="h-6 w-6 text-seafoam" />
              </div>
              <div>
                <h3 className="font-semibold">Fraîcheur Quotidienne</h3>
                <p className="text-sm text-white/70">Pêché frais chaque matin</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-seafoam/20 p-3 rounded-full">
                <Truck className="h-6 w-6 text-seafoam" />
              </div>
              <div>
                <h3 className="font-semibold">Livraison Rapide</h3>
                <p className="text-sm text-white/70">Livraison le jour même disponible</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-seafoam/20 p-3 rounded-full">
                <Shield className="h-6 w-6 text-seafoam" />
              </div>
              <div>
                <h3 className="font-semibold">Qualité Garantie</h3>
                <p className="text-sm text-white/70">100% satisfaction promise</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 fill-background"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};