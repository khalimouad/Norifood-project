import { Button } from '@/components/ui/button';
import { ArrowRight, Timer, Star, Award } from 'lucide-react';
import heroImage from '@/assets/hero-seafood.jpg';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

export const Hero = () => {
  return (
    <section className="bg-white py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight">
              Produits de la Mer
              <span className="block text-ocean text-xl md:text-4xl mt-1 md:mt-2">Frais Quotidiennement</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-lg mx-auto lg:mx-0 px-4 md:px-0">
              Poissons et fruits de mer de qualité premium, de l'océan à votre table avec fraîcheur garantie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 md:px-0">
              <Button className="bg-ocean hover:bg-ocean/90 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-sm md:text-base">
                Commander Maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean/10 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-sm md:text-base">
                Nos Promotions
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-center lg:text-left px-2 md:px-0">
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-2 md:p-0">
                <div className="bg-ocean/10 p-2 rounded-full flex-shrink-0">
                  <Timer className="h-4 w-4 text-ocean" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Livraison Rapide</p>
                  <p className="text-xs text-gray-600">Même jour</p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-2 md:p-0">
                <div className="bg-ocean/10 p-2 rounded-full flex-shrink-0">
                  <Star className="h-4 w-4 text-ocean" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Fraîcheur</p>
                  <p className="text-xs text-gray-600">Garantie</p>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 p-2 md:p-0">
                <div className="bg-ocean/10 p-2 rounded-full flex-shrink-0">
                  <Award className="h-4 w-4 text-ocean" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Qualité</p>
                  <p className="text-xs text-gray-600">Premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={salmonImage} alt="Saumon" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Saumon Frais</h3>
                  <p className="text-xs text-gray-600">À partir de 249 DH/kg</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={wholeFishImage} alt="Poisson entier" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Poisson Entier</h3>
                  <p className="text-xs text-gray-600">À partir de 189 DH/kg</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={shrimpImage} alt="Crevettes" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">Crevettes</h3>
                  <p className="text-xs text-gray-600">À partir de 329 DH/kg</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-ocean to-ocean-light rounded-xl p-4 text-white">
                <h3 className="font-bold text-sm mb-2">Offre Spéciale</h3>
                <p className="text-xs mb-2">-20% sur votre première commande</p>
                <Button size="sm" className="bg-white text-ocean hover:bg-gray-100 text-xs px-3 py-1">
                  Profiter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};