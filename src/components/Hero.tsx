import { Button } from '@/components/ui/button';
import { ArrowRight, Fish, Truck, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-seafood.jpg';

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-ocean to-ocean-light px-4 py-8">
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
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Produits de la Mer
          <span className="block text-seafoam text-2xl md:text-3xl mt-1">Frais Quotidiennement</span>
        </h1>
        <p className="text-white/90 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          Poissons et fruits de mer de qualité premium, de l'océan à votre table.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-sm mx-auto">
          <Button className="bg-coral hover:bg-coral/90 text-white shadow-lg rounded-full py-3 px-6 font-medium">
            Commander Maintenant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full py-3 px-6">
            Voir le Menu
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <div className="bg-seafoam/20 p-2 rounded-full">
              <Fish className="h-4 w-4 text-seafoam" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Fraîcheur Quotidienne</h3>
              <p className="text-xs text-white/70">Pêché frais chaque matin</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <div className="bg-seafoam/20 p-2 rounded-full">
              <Truck className="h-4 w-4 text-seafoam" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Livraison Rapide</h3>
              <p className="text-xs text-white/70">Livraison le jour même</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 text-white/90">
            <div className="bg-seafoam/20 p-2 rounded-full">
              <Shield className="h-4 w-4 text-seafoam" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Qualité Garantie</h3>
              <p className="text-xs text-white/70">100% satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};