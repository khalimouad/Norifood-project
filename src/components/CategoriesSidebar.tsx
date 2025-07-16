import { useState } from 'react';
import { X, Fish, Shell, Waves, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  count: number;
}

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, onOpenChange }: CategoriesSidebarProps) => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      id: 'fish',
      name: 'Poissons Frais',
      icon: Fish,
      description: 'Poissons pêchés du jour',
      count: 15
    },
    {
      id: 'seafood',
      name: 'Fruits de Mer',
      icon: Shell,
      description: 'Crevettes, crabes, homards',
      count: 8
    },
    {
      id: 'prepared',
      name: 'Produits Préparés',
      icon: Package,
      description: 'Plats cuisinés et marinés',
      count: 12
    },
    {
      id: 'premium',
      name: 'Sélection Premium',
      icon: Waves,
      description: 'Nos meilleurs produits',
      count: 6
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
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
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-full p-4 rounded-lg border border-gray-200 hover:border-ocean hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ocean/10 rounded-lg group-hover:bg-ocean/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-ocean" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-ocean transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count} produits
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6 pt-0">
          <Button
            onClick={() => {
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