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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Catégories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de produits de la mer frais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {category.featured && (
                  <Badge className="absolute top-4 left-4 bg-ocean text-white">
                    Vedette
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} produits
                  </span>
                  <Button className="bg-ocean hover:bg-ocean/90 text-white px-6">
                    Voir Tout
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};