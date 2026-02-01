import { Badge } from "@/components/ui/badge";
import { Star, Check } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type ProductVariation = Tables<"product_variations">;

interface ProductInfoProps {
  product: Product;
  selectedVariation: ProductVariation | null;
}

export const ProductInfo = ({ product, selectedVariation }: ProductInfoProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {product.featured && (
          <Badge className="bg-accent text-accent-foreground">Produit Vedette</Badge>
        )}
        {product.stock_quantity && product.stock_quantity > 0 ? (
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
            <Check className="h-3 w-3 mr-1" />
            En Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600 dark:text-red-400 dark:border-red-400">
            Rupture de Stock
          </Badge>
        )}
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-4">
        {product.name}
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-current" />
          ))}
        </div>
      </div>
      <div className="text-3xl font-bold text-primary mb-4">
        {selectedVariation ? selectedVariation.price : product.base_price} DH
        <span className="text-lg font-normal text-muted-foreground ml-2">
          {selectedVariation ? `/ pièce (${selectedVariation.weight_kg}kg)` : `/ ${product.unit_type}`}
        </span>
      </div>
    </div>
  );
};
