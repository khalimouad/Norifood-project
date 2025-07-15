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
    <section id="categories" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Nos Catégories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection soigneusement choisie de produits de la mer frais, 
            organisés par catégorie pour votre commodité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer hover:shadow-float transition-all duration-300 border-0 bg-card overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {category.featured && (
                  <Badge className="absolute top-3 left-3 bg-coral text-white">
                    Vedette
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.productCount} produits
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-ocean hover:text-ocean-light hover:bg-ocean/10 group-hover:bg-ocean group-hover:text-white transition-colors"
                  >
                    Voir Tout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-ocean hover:opacity-90 text-white shadow-ocean"
          >
            Voir Toutes les Catégories
          </Button>
        </div>
      </div>
    </section>
  );
};