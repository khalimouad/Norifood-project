import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Fish,
  FishSymbol,
  Shell,
  Waves,
  UtensilsCrossed,
  Anchor,
  Droplets,
  Sparkles,
  LayoutGrid
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

const getCategoryIcon = (categoryName: string) => {
  const n = categoryName.toLowerCase();
  if (n.includes('poisson') || n.includes('fish')) return Fish;
  if (n.includes('crevette') || n.includes('shrimp')) return FishSymbol;
  if (n.includes('crabe') || n.includes('crab') || n.includes('homard') || n.includes('lobster')) return Shell;
  if (n.includes('coquillage') || n.includes('shell') || n.includes('moule') || n.includes('huitre') || n.includes('oyster')) return Shell;
  if (n.includes('calmar') || n.includes('poulpe') || n.includes('octop') || n.includes('squid')) return Anchor;
  if (n.includes('frai') || n.includes('fresh') || n.includes('mer') || n.includes('sea')) return Waves;
  if (n.includes('promo') || n.includes('offre') || n.includes('special')) return Sparkles;
  if (n.includes('recette') || n.includes('recipe')) return UtensilsCrossed;
  if (n.includes('sauce') || n.includes('condiment')) return Droplets;
  return FishSymbol;
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

  const isAllActive = selectedCategory === 'all' || !selectedCategory;

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>

      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-4 pt-2 px-2 -mx-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`group flex-shrink-0 flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 button-press focus-ring border ${
            isAllActive
              ? 'bg-glovo-purple text-white border-transparent shadow-lg shadow-glovo-purple/25 scale-[1.03]'
              : 'bg-white dark:bg-card text-foreground border-border hover:border-glovo-purple/40 hover:shadow-md'
          }`}
        >
          <span className={`flex items-center justify-center h-7 w-7 rounded-full transition-colors ${
            isAllActive ? 'bg-white/20' : 'bg-glovo-purple/10 text-glovo-purple group-hover:bg-glovo-purple/15'
          }`}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </span>
          Tout
        </button>

        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 h-11 rounded-full bg-muted/60 animate-pulse"
            />
          ))
        ) : (
          categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group flex-shrink-0 flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 button-press focus-ring border ${
                  isActive
                    ? 'bg-glovo-purple text-white border-transparent shadow-lg shadow-glovo-purple/25 scale-[1.03]'
                    : 'bg-white dark:bg-card text-foreground border-border hover:border-glovo-purple/40 hover:shadow-md'
                }`}
              >
                <span className={`flex items-center justify-center h-7 w-7 rounded-full transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-glovo-purple/10 text-glovo-purple group-hover:bg-glovo-purple/15'
                }`}>
                  <IconComponent className="h-3.5 w-3.5" />
                </span>
                {category.name}
              </button>
            );
          })
        )}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};
