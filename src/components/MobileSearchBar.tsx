import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export const MobileSearchBar = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden bg-background px-4 pt-3 pb-2 border-b border-border">
      <button
        onClick={() => navigate('/products')}
        className="w-full flex items-center gap-3 h-11 px-4 rounded-md bg-card border border-border text-muted-foreground hover:border-primary/50 transition-colors"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="text-sm truncate">Rechercher un produit, une catégorie</span>
      </button>
    </div>
  );
};
