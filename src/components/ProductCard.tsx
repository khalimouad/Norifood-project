import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Scale, Package, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  unitType: 'kg' | 'units' | 'g' | 'pieces';
  inStock: boolean;
  featured?: boolean;
  discount?: number;
}

export const ProductCard = ({ 
  name, 
  description, 
  price, 
  image, 
  unitType, 
  inStock, 
  featured, 
  discount 
}: ProductProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const getUnitIcon = () => {
    switch (unitType) {
      case 'kg':
      case 'g':
        return <Scale className="h-4 w-4" />;
      case 'units':
      case 'pieces':
        return <Package className="h-4 w-4" />;
      default:
        return <Scale className="h-4 w-4" />;
    }
  };

  const getUnitLabel = () => {
    switch (unitType) {
      case 'kg':
        return 'par kg';
      case 'g':
        return 'par 100g';
      case 'units':
        return 'par unité';
      case 'pieces':
        return 'par pièce';
      default:
        return '';
    }
  };

  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Card className="group hover:shadow-float transition-all duration-300 border-0 bg-card overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-coral text-white">Vedette</Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-white">
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Rupture de Stock
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? 'fill-coral text-coral' : 'text-muted-foreground'
            }`}
          />
        </Button>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-card-foreground line-clamp-1">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              {getUnitIcon()}
              <span className="text-sm">{getUnitLabel()}</span>
            </div>
          </div>
          <div className="text-right">
            {discount && (
              <span className="text-sm text-muted-foreground line-through">
                {price.toFixed(2)} DH
              </span>
            )}
            <div className="text-lg font-bold text-ocean">
              {discountedPrice.toFixed(2)} DH
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!inStock}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="min-w-[40px] text-center font-medium">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!inStock}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-seafoam hover:opacity-90 text-white shadow-ocean"
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inStock ? 'Ajouter au Panier' : 'Rupture de Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};