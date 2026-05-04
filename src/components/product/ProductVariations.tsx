import { Tables } from "@/integrations/supabase/types";
import { formatPrice, safeNumber } from "@/lib/format";

type ProductVariation = Tables<"product_variations">;

interface ProductVariationsProps {
  variations: ProductVariation[];
  selectedVariation: ProductVariation | null;
  onSelectVariation: (variation: ProductVariation) => void;
}

export const ProductVariations = ({
  variations,
  selectedVariation,
  onSelectVariation,
}: ProductVariationsProps) => {
  if (variations.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3">Choisir une pièce:</h3>
      <div className="grid gap-3">
        {variations.map((variation) => (
          <div
            key={variation.id}
            onClick={() => onSelectVariation(variation)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
              selectedVariation?.id === variation.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">{variation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {variation.weight_kg}kg • Stock: {variation.stock_quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatPrice(variation.price)} DH</p>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const w = safeNumber(variation.weight_kg);
                    return w > 0 ? `${formatPrice(safeNumber(variation.price) / w)} DH/kg` : '—';
                  })()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
