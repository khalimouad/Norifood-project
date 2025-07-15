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
    <div className="bg-white rounded-2xl md:rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
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
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {featured && (
            <Badge className="bg-ocean text-white text-xs px-2 py-1 rounded-full">Vedette</Badge>
          )}
          {discount && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white h-9 w-9 rounded-full shadow-sm"
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
            <Badge className="bg-white text-gray-900 px-3 py-2 rounded-full">
              Rupture de Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500">
            {getUnitIcon()}
            <span className="text-sm">{getUnitLabel()}</span>
          </div>
          <div className="text-right">
            {discount && (
              <span className="text-sm text-gray-400 line-through block">
                {price.toFixed(2)} DH
              </span>
            )}
            <div className="text-xl font-bold text-ocean">
              {discountedPrice.toFixed(2)} DH
            </div>
          </div>
        </div>

        {/* Mobile-First Quantity and Add to Cart */}
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[48px] text-center text-lg font-semibold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!inStock}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            className="w-full bg-ocean hover:bg-ocean/90 text-white py-3 px-4 rounded-xl font-semibold text-base shadow-sm active:scale-95 transition-transform"
            disabled={!inStock}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {inStock ? 'Ajouter au Panier' : 'Rupture de Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};