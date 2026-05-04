import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { Plus, Minus, Star } from 'lucide-react';
import placeholderImage from '@/assets/placeholder-product.jpg';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  unitType: 'kg' | 'units' | 'g' | 'pieces';
  inStock?: boolean;
  featured?: boolean;
  discount?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  unitType,
  inStock = true,
  featured = false,
  discount,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem({ id, name, price, image, unitType: unitType as string });
    setQuantity((q) => q + 1);
    toast({
      title: 'Ajouté au panier',
      description: name,
    });
  };

  const handleDecrement = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary">
      <div className="relative aspect-square overflow-hidden bg-nori-surface-2">
        <Link to={`/product/${id}`} className="block w-full h-full">
          <img
            src={image || placeholderImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount ? (
            <Badge className="bg-primary text-primary-foreground font-bold text-xs px-2 py-1 rounded-md border-0">
              -{discount}%
            </Badge>
          ) : null}
          {featured && (
            <Badge className="bg-primary text-primary-foreground font-bold text-[10px] px-2 py-1 rounded-md border-0 uppercase tracking-wider">
              <Star className="h-2.5 w-2.5 mr-1 fill-current" />
              Top
            </Badge>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
            <Badge className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md uppercase tracking-wider">
              Rupture
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 md:p-4 gap-2">
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            {discount ? (
              <span className="text-xs text-muted-foreground line-through">
                {price.toFixed(2)} €
              </span>
            ) : null}
            <span className="text-xl md:text-2xl font-extrabold text-primary leading-none truncate">
              {discountedPrice.toFixed(2)} €
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">
              / {unitType}
            </span>
          </div>

          <div className="inline-flex items-center bg-secondary border border-border rounded-md h-9 shrink-0">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1 || !inStock}
              className="h-9 w-8 inline-flex items-center justify-center text-foreground/80 hover:text-primary disabled:opacity-40"
              aria-label="Diminuer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold tabular-nums">{quantity}</span>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="h-9 w-9 inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-nori-light disabled:opacity-40 rounded-r-md"
              aria-label={`Ajouter ${name} au panier`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export { ProductCard };
