import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const featuredProducts = [
  {
    id: '1',
    name: 'Saumon Atlantique Frais',
    description: 'Filet de saumon atlantique de qualité premium, parfait pour griller ou cuire',
    price: 249.99,
    image: salmonImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
    discount: 10,
  },
  {
    id: '2',
    name: 'Grosses Crevettes',
    description: 'Grosses crevettes fraîches parfaites pour tous vos plats de fruits de mer',
    price: 189.99,
    image: shrimpImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Vivaneau Entier',
    description: 'Vivaneau entier frais, nettoyé et prêt à cuisiner',
    price: 329.99,
    image: wholeFishImage,
    unitType: 'pieces' as const,
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Filet de Bar',
    description: 'Filet de bar délicat, pêché de manière durable',
    price: 289.99,
    image: wholeFishImage,
    unitType: 'kg' as const,
    inStock: false,
    featured: true,
  },
  {
    id: '5',
    name: 'Grosses Langoustines',
    description: 'Langoustines extra larges, parfaites pour les occasions spéciales',
    price: 429.99,
    image: shrimpImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
    discount: 15,
  },
  {
    id: '6',
    name: 'Steak de Thon',
    description: 'Steak de thon frais, qualité sushi',
    price: 369.99,
    image: salmonImage,
    unitType: 'kg' as const,
    inStock: true,
    featured: true,
  },
];

export const FeaturedProducts = () => {
  return (
    <section className="py-6 bg-white">
      <div className="px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Produits Vedettes
          </h2>
          <p className="text-gray-600 text-sm">
            Découvrez notre sélection des produits les plus frais
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-6">
          <Button
            className="bg-ocean hover:bg-ocean/90 text-white shadow-lg rounded-full px-6 py-3 font-medium"
          >
            Voir Tous les Produits
          </Button>
        </div>
      </div>
    </section>
  );
};