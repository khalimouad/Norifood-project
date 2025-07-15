import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const categories = [
  {
    name: 'Poissons Entiers',
    description: 'Sélection quotidienne de poissons entiers',
    image: wholeFishImage,
    productCount: 15,
    featured: true,
  },
  {
    name: 'Filets de Poissons',
    description: 'Filets de poissons prêts à cuisiner',
    image: salmonImage,
    productCount: 12,
    featured: false,
  },
  {
    name: 'Crustacés',
    description: 'Crustacés frais et de qualité',
    image: shrimpImage,
    productCount: 8,
    featured: false,
  },
  {
    name: 'Céphalopodes',
    description: 'Pieuvres, seiches et calmars',
    image: wholeFishImage,
    productCount: 20,
    featured: false,
  },
  {
    name: 'Poissons Fumés',
    description: 'Poissons fumés artisanaux',
    image: salmonImage,
    productCount: 6,
    featured: false,
  },
  {
    name: 'Produits Élaborés',
    description: 'Produits transformés et élaborés',
    image: shrimpImage,
    productCount: 10,
    featured: false,
  },
];

export const Categories = () => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Nos Catégories
          </h2>
          <p className="text-gray-600 text-sm">
            Découvrez notre sélection de produits de la mer frais
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {category.featured && (
                  <Badge className="absolute top-2 left-2 bg-coral text-white text-xs px-2 py-1">
                    Vedette
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {category.productCount} produits
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button
            className="bg-ocean hover:bg-ocean/90 text-white shadow-lg rounded-full px-6 py-3 font-medium"
          >
            Voir Toutes les Catégories
          </Button>
        </div>
      </div>
    </section>
  );
};