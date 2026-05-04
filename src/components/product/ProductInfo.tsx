import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { formatPrice } from '@/lib/format';

type Product = Tables<'products'>;
type ProductVariation = Tables<'product_variations'>;

interface ProductInfoProps {
  product: Product;
  selectedVariation: ProductVariation | null;
}

export const ProductInfo = ({ product, selectedVariation }: ProductInfoProps) => {
  const inStock = (selectedVariation ? selectedVariation.stock_quantity : product.stock_quantity) ?? 0;
  const price = selectedVariation ? selectedVariation.price : product.base_price;
  const unit = selectedVariation ? `pièce (${selectedVariation.weight_kg}kg)` : product.unit_type;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {product.featured && (
          <Badge className="bg-primary text-primary-foreground border-0 uppercase text-[10px] tracking-wider">
            Top vente
          </Badge>
        )}
        {inStock > 0 ? (
          <Badge variant="outline" className="text-primary border-primary/40 uppercase text-[10px] tracking-wider">
            <Check className="h-3 w-3 mr-1" />
            En stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-border text-muted-foreground uppercase text-[10px] tracking-wider">
            Rupture
          </Badge>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
        {product.name}
      </h1>

      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-4 w-4 fill-primary text-primary" />
        ))}
        <span className="text-xs text-muted-foreground ml-1">(qualité pro)</span>
      </div>

      <div className="flex items-baseline gap-2 pt-1">
        <span className="text-4xl md:text-5xl font-extrabold text-primary leading-none">
          {formatPrice(price)} €
        </span>
        <span className="text-sm text-muted-foreground">/ {unit}</span>
      </div>
    </div>
  );
};
