import { useState, useEffect } from 'react';
import {
  Fish, Waves, Apple, Carrot, Leaf, Anchor, Shell, Droplet, Flame, Package,
  Beef, Soup, UtensilsCrossed, Star, Heart, Sparkles, Crown, Gem, Award, Zap,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CategoryGridSkeleton } from './skeletons/CategorySkeleton';

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  custom_svg?: string;
  slug: string;
  is_active: boolean;
  image_url?: string;
}

const iconMap = {
  apple: Apple, carrot: Carrot, leaf: Leaf, fish: Fish, waves: Waves,
  anchor: Anchor, shell: Shell, droplet: Droplet, flame: Flame, package: Package,
  beef: Beef, soup: Soup, 'utensils-crossed': UtensilsCrossed, star: Star,
  heart: Heart, sparkles: Sparkles, crown: Crown, gem: Gem, award: Award,
  zap: Zap, 'shopping-cart': ShoppingCart,
};

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
          .limit(8);
        if (data) setCategories(data);
      } catch (e) {
        console.error('Error fetching categories:', e);
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
            <p className="nori-section-title text-primary mb-2">Nos catégories</p>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Explorez notre sélection
            </h2>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="hidden md:inline-flex text-sm font-semibold uppercase tracking-wide text-primary hover:text-nori-light transition-colors"
          >
            Voir tout →
          </button>
        </div>

        {loading ? (
          <CategoryGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 md:gap-3">
            {categories.map((category) => {
              const IconComponent = category.custom_svg
                ? null
                : category.icon
                  ? iconMap[category.icon as keyof typeof iconMap]
                  : Fish;
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/products?category=${category.slug}`)}
                  className="group flex flex-col items-center justify-center gap-2 px-2 py-4 md:py-5 rounded-xl bg-card border border-border hover:border-primary hover:bg-secondary transition-colors"
                >
                  {IconComponent ? (
                    <IconComponent
                      className="h-7 w-7 md:h-8 md:w-8 text-foreground/80 group-hover:text-primary transition-colors"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Fish
                      className="h-7 w-7 md:h-8 md:w-8 text-foreground/80 group-hover:text-primary transition-colors"
                      strokeWidth={1.5}
                    />
                  )}
                  <span className="text-[11px] md:text-xs font-semibold text-center text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
