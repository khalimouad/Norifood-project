import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const categories = [
  {
    name: 'Fresh Fish',
    description: 'Daily fresh fish selection',
    image: wholeFishImage,
    productCount: 15,
    featured: true,
  },
  {
    name: 'Seafood',
    description: 'Premium seafood selection',
    image: shrimpImage,
    productCount: 12,
    featured: false,
  },
  {
    name: 'Fillets',
    description: 'Ready-to-cook fish fillets',
    image: salmonImage,
    productCount: 8,
    featured: false,
  },
  {
    name: 'Frozen',
    description: 'Frozen fish and seafood',
    image: wholeFishImage,
    productCount: 20,
    featured: false,
  },
];

export const Categories = () => {
  return (
    <section id="categories" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully curated selection of fresh seafood, organized by category 
            for your convenience.
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
                    Featured
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
                    {category.productCount} products
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-ocean hover:text-ocean-light hover:bg-ocean/10 group-hover:bg-ocean group-hover:text-white transition-colors"
                  >
                    View All
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
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};