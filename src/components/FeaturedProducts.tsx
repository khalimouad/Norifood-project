import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
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
      const {
        data,
        error
      } = await supabase.from('products').select('*').eq('featured', true).eq('is_active', true).limit(8);
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <section className="py-8 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des produits vedettes...</p>
          </div>
        </div>
      </section>;
  }
  return <section className="py-8 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-4">
            Produits Vedettes
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Découvrez notre sélection des produits les plus frais
          </p>
        </div>

        {products.length > 0 ? <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => <ProductCard key={product.id} id={product.id} name={product.name} description={product.description} price={product.base_price} image={product.image_url} unitType={product.unit_type === 'l' ? 'units' : product.unit_type as 'kg' | 'pieces' | 'g' | 'units'} inStock={product.stock_quantity > 0} featured={product.featured} />)}
            </div>

            <div className="text-center mt-8 md:mt-12">
              <Link to="/products">
                <Button className="px-6 py-3 rounded-full font-medium bg-blue-900 hover:bg-blue-800 text-slate-50">
                  Voir Tous les Produits
                </Button>
              </Link>
            </div>
          </> : <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit vedette disponible pour le moment.</p>
          </div>}
      </div>
    </section>;
};