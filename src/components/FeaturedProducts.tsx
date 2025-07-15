import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const featuredProducts = [
  {
    id: '1',
    name: 'Fresh Atlantic Salmon',
    description: 'Premium quality Atlantic salmon fillet, perfect for grilling or baking',
    price: 24.99,
    image: salmonImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
    discount: 10,
  },
  {
    id: '2',
    name: 'Jumbo Shrimp',
    description: 'Large, fresh shrimp perfect for any seafood dish',
    price: 18.99,
    image: shrimpImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Whole Red Snapper',
    description: 'Fresh whole red snapper, cleaned and ready to cook',
    price: 32.99,
    image: wholeFishImage,
    unitType: 'pieces' as const,
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Sea Bass Fillet',
    description: 'Delicate sea bass fillet, sustainably sourced',
    price: 28.99,
    image: wholeFishImage,
    unitType: 'kg' as const,
    inStock: false,
    featured: true,
  },
  {
    id: '5',
    name: 'King Prawns',
    description: 'Extra large king prawns, perfect for special occasions',
    price: 42.99,
    image: shrimpImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
    discount: 15,
  },
  {
    id: '6',
    name: 'Tuna Steak',
    description: 'Fresh tuna steak, sushi grade quality',
    price: 36.99,
    image: salmonImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the freshest and finest seafood, 
            carefully sourced from trusted suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-ocean hover:opacity-90 text-white shadow-ocean"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};