import { useState, useEffect } from 'react';
import { Fish, Shell, Waves, Package, Apple, Carrot, Leaf, Anchor, Droplet, Flame, Beef, Soup, UtensilsCrossed, Star, Heart, Sparkles, Crown, Gem, Award, Zap, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  custom_svg?: string;
  slug: string;
  is_active: boolean;
  productCount?: number;
}

const iconMap = {
  apple: Apple,
  carrot: Carrot,
  leaf: Leaf,
  fish: Fish,
  waves: Waves,
  anchor: Anchor,
  shell: Shell,
  droplet: Droplet,
  flame: Flame,
  package: Package,
  beef: Beef,
  soup: Soup,
  'utensils-crossed': UtensilsCrossed,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
  crown: Crown,
  gem: Gem,
  award: Award,
  zap: Zap,
  'shopping-cart': ShoppingCart,
};

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, onOpenChange }: CategoriesSidebarProps) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    window.scrollTo(0, 0);
    navigate(`/products?category=${categorySlug}`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-xl font-bold text-gray-900">
            Nos Catégories
          </SheetTitle>
          <p className="text-sm text-gray-600 text-left">
            Découvrez nos produits frais par catégorie
          </p>
        </SheetHeader>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : (
            categories.map((category) => {
              const IconComponent = category.custom_svg ? null : (category.icon ? iconMap[category.icon as keyof typeof iconMap] : Fish);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-ocean hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-ocean/10 rounded-lg group-hover:bg-ocean/20 transition-colors">
                      {category.custom_svg ? (
                        <div 
                          className="h-6 w-6 text-ocean"
                          dangerouslySetInnerHTML={{ __html: category.custom_svg }}
                        />
                      ) : IconComponent ? (
                        <IconComponent className="h-6 w-6 text-ocean" />
                      ) : (
                        <Fish className="h-6 w-6 text-ocean" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-ocean transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {category.description || 'Découvrez nos produits de qualité'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-6 pt-0">
          <Button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/products');
              onOpenChange(false);
            }}
            className="w-full"
            size="lg"
          >
            Voir Tous les Produits
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};