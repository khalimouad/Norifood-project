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
    (async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .eq('is_active', true)
          .limit(8);
        if (data) setProducts(data);
      } catch (e) {
        console.error('Error fetching featured products:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-10 md:py-16 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="nori-section-title text-primary mb-2">Meilleures ventes</p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Les références préférées des chefs
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex text-sm font-semibold uppercase tracking-wide text-primary hover:text-nori-light transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  price={p.base_price}
                  image={p.image_url}
                  unitType={
                    p.unit_type === 'l'
                      ? 'units'
                      : (p.unit_type as 'kg' | 'pieces' | 'g' | 'units')
                  }
                  inStock={p.stock_quantity > 0}
                  featured={p.featured}
                />
              ))}
            </div>

            <div className="text-center mt-10 md:hidden">
              <Link to="/products">
                <Button className="h-11 px-6 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide">
                  Voir tout le catalogue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 md:py-16">
            <p className="text-muted-foreground">Aucun produit vedette disponible.</p>
          </div>
        )}
      </div>
    </section>
  );
};
