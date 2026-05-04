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
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
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
                  className="group flex flex-col items-center gap-2.5 p-3 rounded-xl bg-card border border-border hover:border-primary/60 hover:bg-secondary transition-all duration-200"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-nori-surface-2 to-black border border-border overflow-hidden flex items-center justify-center group-hover:border-primary/60 transition-colors">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : IconComponent ? (
                      <IconComponent className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    ) : (
                      <Fish className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    )}
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors line-clamp-2">
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
