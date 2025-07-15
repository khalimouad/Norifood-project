import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Scale, Package, Heart, Plus, Minus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getUnitIcon = () => {
    switch (unitType) {
      case 'kg':
      case 'g':
        return <Scale className="h-3 w-3" />;
      case 'units':
      case 'pieces':
        return <Package className="h-3 w-3" />;
      default:
        return <Scale className="h-3 w-3" />;
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
    <div className="bg-white rounded-xl md:rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 active:scale-95 md:active:scale-100">
      <div className="relative aspect-square overflow-hidden">
        <div ref={imgRef} className="w-full h-full bg-gray-200">
          {isInView && (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {featured && (
            <Badge className="bg-ocean text-white text-xs px-2 py-1">Vedette</Badge>
          )}
          {discount && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white h-8 w-8 rounded-full"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>

        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-white text-gray-900 px-3 py-1 text-xs">
              Rupture de Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm mb-2 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            {getUnitIcon()}
            <span className="text-xs">{getUnitLabel()}</span>
          </div>
          <div className="text-right">
            {discount && (
              <span className="text-xs text-gray-400 line-through block">
                {price.toFixed(2)} DH
              </span>
            )}
            <div className="text-base md:text-lg font-bold text-ocean">
              {discountedPrice.toFixed(2)} DH
            </div>
          </div>
        </div>

        {/* Mobile Quantity and Add to Cart */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!inStock}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-[32px] text-center text-sm font-medium">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!inStock}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            className="flex-1 bg-ocean hover:bg-ocean/90 text-white text-sm py-2 rounded-full font-medium"
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {inStock ? 'Ajouter' : 'Épuisé'}
          </Button>
        </div>

        {/* Desktop Quantity and Add to Cart */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!inStock}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
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
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            className="w-full bg-ocean hover:bg-ocean/90 text-white"
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inStock ? 'Ajouter au Panier' : 'Rupture de Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};