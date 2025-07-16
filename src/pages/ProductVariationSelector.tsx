import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

interface ProductVariation {
  id: string;
  name: string;
  price: number;
  weight_kg: number;
  stock_quantity: number;
  is_active: boolean;
}

interface ProductVariationSelectorProps {
  variations: ProductVariation[];
  onVariationSelect: (variation: ProductVariation) => void;
  selectedVariation?: ProductVariation;
  className?: string;
}

export const ProductVariationSelector = ({
  variations,
  onVariationSelect,
  selectedVariation,
  className = "",
}: ProductVariationSelectorProps) => {
  const [hoveredVariation, setHoveredVariation] = useState<string | null>(null);

  const activeVariations = variations.filter(v => v.is_active && v.stock_quantity > 0);

  if (activeVariations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Pièces Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune pièce disponible pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Choisir une Pièce</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sélectionnez la pièce que vous souhaitez commander
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {activeVariations.map((variation) => (
            <div
              key={variation.id}
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all
                ${selectedVariation?.id === variation.id 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border hover:border-muted-foreground/50'
                }
                ${hoveredVariation === variation.id ? 'shadow-md' : ''}
              `}
              onClick={() => onVariationSelect(variation)}
              onMouseEnter={() => setHoveredVariation(variation.id)}
              onMouseLeave={() => setHoveredVariation(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{variation.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {variation.weight_kg} kg
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <Badge variant="secondary" className="text-xs">
                          {variation.stock_quantity} en stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {variation.price.toFixed(2)} MAD
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(variation.price / variation.weight_kg).toFixed(2)} MAD/kg
                  </div>
                </div>
              </div>
              
              {selectedVariation?.id === variation.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {selectedVariation && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Pièce sélectionnée:</span>
                <div className="text-sm text-muted-foreground">
                  {selectedVariation.name} - {selectedVariation.weight_kg} kg
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {selectedVariation.price.toFixed(2)} MAD
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};