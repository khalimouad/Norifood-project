import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fish, Waves, Utensils, Snowflake, Flame, Package } from 'lucide-react';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const categories = [
  {
    name: 'Poissons Entiers',
    description: 'Sélection quotidienne de poissons entiers',
    image: wholeFishImage,
    icon: Fish,
    productCount: 15,
    featured: true,
  },
  {
    name: 'Filets de Poissons',
    description: 'Filets de poissons prêts à cuisiner',
    image: salmonImage,
    icon: Utensils,
    productCount: 12,
    featured: false,
  },
  {
    name: 'Crustacés',
    description: 'Crustacés frais et de qualité',
    image: shrimpImage,
    icon: Waves,
    productCount: 8,
    featured: false,
  },
  {
    name: 'Céphalopodes',
    description: 'Pieuvres, seiches et calmars',
    image: wholeFishImage,
    icon: Package,
    productCount: 20,
    featured: false,
  },
  {
    name: 'Poissons Fumés',
    description: 'Poissons fumés artisanaux',
    image: salmonImage,
    icon: Flame,
    productCount: 6,
    featured: false,
  },
  {
    name: 'Produits Élaborés',
    description: 'Produits transformés et élaborés',
    image: shrimpImage,
    icon: Snowflake,
    productCount: 10,
    featured: false,
  },
];

export const Categories = () => {
  return (
    <section className="py-8 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Catégories
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Découvrez notre sélection de produits de la mer frais
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white rounded-xl md:rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-square md:aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {category.featured && (
                  <Badge className="absolute top-2 left-2 bg-ocean text-white text-xs px-2 py-1">
                    Vedette
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <category.icon className="h-4 w-4 text-ocean" />
                </div>
                <div className="absolute bottom-3 left-3 right-3 md:p-0">
                  <h3 className="font-bold text-white text-sm md:text-base mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-xs hidden md:block">
                    {category.description}
                  </p>
                  <p className="text-white/80 text-xs">
                    {category.productCount} produits
                  </p>
                </div>
              </div>
              <div className="p-3 md:p-6 hidden md:block">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} produits
                  </span>
                  <Button className="bg-ocean hover:bg-ocean/90 text-white px-4 py-2 text-sm">
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