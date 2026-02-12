import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Fish,
  Shrimp,
  Crab,
  Shell,
  Waves,
  UtensilsCrossed,
  Star,
  ChevronRight
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryPillsProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

const categoryIcons: Record<string, any> = {
  'fish': Fish,
  'seafood': Shrimp,
  'crustaceans': Crab,
  'shellfish': Shell,
  'fresh': Waves,
  'recipes': UtensilsCrossed,
  'default': Star,
};

const getCategoryIcon = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes('poisson') || lowerName.includes('fish')) return Fish;
  if (lowerName.includes('crevette') || lowerName.includes('shrimp')) return Shrimp;
  if (lowerName.includes('crabe') || lowerName.includes('crab')) return Crab;
  if (lowerName.includes('coquillage') || lowerName.includes('shell')) return Shell;
  if (lowerName.includes('frai') || lowerName.includes('fresh')) return Waves;
  return Star;
};

export const CategoryPills = ({ selectedCategory, onSelectCategory }: CategoryPillsProps) => {
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
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="relative">
      {/* Fade effect on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none rounded-l-full"></div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 pt-2 px-2 -mx-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`category-pill flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 button-press focus-ring ${
            selectedCategory === 'all' || !selectedCategory
              ? 'bg-gradient-to-r from-glovo-purple to-glovo-orange text-white shadow-lg shadow-glovo-purple/20 scale-105'
              : 'bg-white dark:bg-gray-800 text-foreground hover:bg-glovo-purple/10 border border-border shadow-sm'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            Tout
          </span>
        </button>

        {loading ? (
          // Skeleton loaders
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-28 h-11 rounded-2xl bg-muted/50 animate-pulse"
            />
          ))
        ) : (
          categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`category-pill flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 button-press focus-ring ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-glovo-purple to-glovo-orange text-white shadow-lg shadow-glovo-purple/20 scale-105'
                    : 'bg-white dark:bg-gray-800 text-foreground hover:bg-glovo-purple/10 border border-border shadow-sm'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Fade effect on right side */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none rounded-r-full"></div>
    </div>
  );
};
