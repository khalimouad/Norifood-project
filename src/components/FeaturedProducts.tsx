import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ProductGridSkeleton } from './skeletons/ProductCardSkeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  unit_type: string;
  is_active: boolean;
  featured: boolean;
  stock_quantity: number;
}

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-10 lg:mb-12 space-y-2 md:space-y-3">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Produits Vedettes
            </h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Découvrez notre sélection des produits les plus frais
            </p>
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    );
  }
  return <section className="py-8 md:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10 lg:mb-12 space-y-2 md:space-y-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Produits Vedettes
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Découvrez notre sélection des produits les plus frais
          </p>
        </div>

        {products.length > 0 ? <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {products.map(product => <ProductCard key={product.id} id={product.id} name={product.name} description={product.description} price={product.base_price} image={product.image_url} unitType={product.unit_type === 'l' ? 'units' : product.unit_type as 'kg' | 'pieces' | 'g' | 'units'} inStock={product.stock_quantity > 0} featured={product.featured} />)}
            </div>

            <div className="text-center mt-8 md:mt-10 lg:mt-12">
              <Link to="/products">
                <Button className="px-6 md:px-8 py-3 md:py-3.5 rounded-full font-medium bg-glovo-purple text-white shadow-lg shadow-glovo-purple/20 hover:shadow-xl hover:shadow-glovo-purple/30 transition-all button-press">
                  Voir Tous les Produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </> : <div className="text-center py-12 md:py-16">
            <p className="text-muted-foreground">Aucun produit vedette disponible pour le moment.</p>
          </div>}
      </div>
    </section>;
};