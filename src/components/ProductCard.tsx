import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
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
  description,
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

  const handleAddToCart = () => {
    addItem({ id, name, price, image, unitType: unitType as string });
    toast({
      title: 'Ajouté au panier',
      description: `${quantity} × ${name}`,
    });
  };

  const updateQuantity = (n: number) => {
    if (n >= 1) setQuantity(n);
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/60 hover:shadow-[0_12px_30px_-12px_hsl(var(--nori-red)/0.45)]">
      <div className="relative aspect-square overflow-hidden bg-nori-surface-2">
        <Link to={`/product/${id}`} className="block w-full h-full">
          <img
            src={image || placeholderImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount ? (
            <Badge className="bg-primary text-primary-foreground font-bold text-xs px-2 py-1 rounded-md border-0">
              -{discount}%
            </Badge>
          ) : null}
          {featured && (
            <Badge className="bg-black/80 text-foreground font-bold text-[10px] px-2 py-1 rounded-md border border-border backdrop-blur-sm">
              <Star className="h-2.5 w-2.5 mr-1 fill-primary text-primary" />
              TOP
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

        <div className="flex items-baseline gap-2">
          {discount ? (
            <span className="text-xs text-muted-foreground line-through">
              {price.toFixed(2)} €
            </span>
          ) : null}
          <span className="text-xl md:text-2xl font-extrabold text-primary leading-none">
            {discountedPrice.toFixed(2)} €
          </span>
          <span className="text-xs text-muted-foreground">/ {unitType}</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <div className="inline-flex items-center bg-secondary rounded-md border border-border h-9">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1 || !inStock}
              className="h-9 w-8 p-0 rounded-none hover:bg-primary/10 hover:text-primary"
              aria-label="Diminuer"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 text-center text-sm font-bold tabular-nums">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={!inStock}
              className="h-9 w-8 p-0 rounded-none hover:bg-primary/10 hover:text-primary"
              aria-label="Augmenter"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            size="sm"
            className="flex-1 h-9 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-semibold text-xs uppercase tracking-wide gap-1.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </div>
    </article>
  );
};

export { ProductCard };
