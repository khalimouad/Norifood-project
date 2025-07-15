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
    <div className="bg-white rounded-3xl md:rounded-xl overflow-hidden shadow-subtle hover:shadow-elegant transition-all duration-300 active:scale-[0.98] md:active:scale-100">
      {/* Image Container with improved aspect ratio for mobile */}
      <div className="relative aspect-[4/3] md:aspect-square overflow-hidden">
        <div ref={imgRef} className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
          {isInView && (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          )}
        </div>
        
        {/* Badges with better mobile spacing */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-ocean text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              Vedette
            </Badge>
          )}
          {discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Like Button with better touch target */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm hover:bg-white h-11 w-11 md:h-9 md:w-9 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-5 w-5 md:h-4 md:w-4 transition-all duration-200 ${
              isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'
            }`}
          />
        </Button>

        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Badge className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg">
              Rupture de Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content with improved mobile padding and text sizing */}
      <div className="p-4 md:p-4">
        <h3 className="font-bold text-gray-900 text-base md:text-base mb-2 leading-tight">
          {name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* Price and unit info with compact mobile layout */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            {getUnitIcon()}
            <span className="font-medium">{getUnitLabel()}</span>
          </div>
          <div className="text-right">
            {discount && (
              <span className="text-xs text-gray-400 line-through block">
                {price.toFixed(2)} DH
              </span>
            )}
            <div className="text-lg font-bold text-ocean">
              {discountedPrice.toFixed(2)} DH
            </div>
          </div>
        </div>

        {/* Enhanced mobile-first controls with compact spacing */}
        <div className="space-y-3">
          {/* Quantity selector with compact mobile design */}
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
                className="h-9 w-9 p-0 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[40px] text-center text-lg font-bold text-gray-900">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!inStock}
                className="h-9 w-9 p-0 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to cart button with proper text sizing */}
          <Button
            className="w-full bg-gradient-to-r from-ocean to-ocean/90 hover:from-ocean/90 hover:to-ocean text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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