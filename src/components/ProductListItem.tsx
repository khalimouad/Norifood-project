import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import placeholderImage from '@/assets/placeholder-product.jpg';
import { formatPrice, safeNumber } from '@/lib/format';

interface ProductListItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  unitType: 'kg' | 'units' | 'g' | 'pieces';
  inStock?: boolean;
  weight?: number;
}

export const ProductListItem = ({
  id,
  name,
  price,
  image,
  unitType,
  inStock = true,
  weight,
}: ProductListItemProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const safePrice = safeNumber(price);
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: safePrice, image, unitType: unitType as string });
    toast({ title: 'Ajouté', description: name });
  };

  return (
    <Link
      to={`/product/${id}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/60 transition-colors"
    >
      <img
        src={image || placeholderImage}
        alt={name}
        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover bg-secondary border border-border shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2 leading-tight">
          {name}
        </h3>
        {weight && (
          <p className="text-xs text-muted-foreground mt-0.5">{weight} kg</p>
        )}
        <p className="text-base md:text-lg font-extrabold text-primary mt-1 leading-none">
          {formatPrice(price)} €
          <span className="text-xs text-muted-foreground font-normal ml-1">/ {unitType}</span>
        </p>
      </div>
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className="shrink-0 w-10 h-10 rounded-md bg-primary text-primary-foreground hover:bg-nori-light disabled:opacity-40 inline-flex items-center justify-center shadow-[0_4px_12px_-2px_hsl(var(--nori-red)/0.4)]"
        aria-label={`Ajouter ${name}`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </Link>
  );
};
