import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fish, Waves, Apple, Carrot, Leaf, Anchor, Shell, Droplet, Flame, Package, Beef, Soup, UtensilsCrossed, Star, Heart, Sparkles, Crown, Gem, Award, Zap, ShoppingCart } from 'lucide-react';
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
  image_url?: string;
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

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')
        .limit(6);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
  };

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des catégories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
            Nos Catégories
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Découvrez nos produits frais organisés par catégorie
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const IconComponent = category.custom_svg ? null : (category.icon ? iconMap[category.icon as keyof typeof iconMap] : Fish);
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                onClick={() => handleCategoryClick(category.slug)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="p-3 bg-ocean/10 rounded-full group-hover:bg-ocean/20 transition-colors">
                      {category.custom_svg ? (
                        <div 
                          className="h-8 w-8 text-ocean"
                          dangerouslySetInnerHTML={{ __html: category.custom_svg }}
                        />
                      ) : IconComponent ? (
                        <IconComponent className="h-8 w-8 text-ocean" />
                      ) : (
                        <Fish className="h-8 w-8 text-ocean" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-ocean transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {category.description || 'Découvrez nos produits'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button 
            onClick={() => navigate('/products')}
            className="bg-ocean hover:bg-ocean/90 text-white px-6 py-3 rounded-full font-medium"
          >
            Voir Toutes les Catégories
          </Button>
        </div>
      </div>
    </section>
  );
};