import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

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

const ProductCard = ({ id, name, description, price, image, unitType, inStock = true, featured = false, discount }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image,
      unitType: unitType as string
    });
    
    toast({
      title: "Produit ajouté !",
      description: `${quantity} ${unitType} de ${name} ajouté(s) au panier`
    });
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };


  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative group overflow-hidden rounded-lg">
          <Link to={`/product/${id}`}>
            <img 
              src={image} 
              alt={name}
              className="w-full h-32 md:h-48 object-cover transition-transform group-hover:scale-105"
            />
          </Link>
          {discount && (
            <Badge className="absolute top-2 left-2 bg-coral text-white">
              -{discount}%
            </Badge>
          )}
          {featured && (
            <Badge className="absolute top-2 right-2 bg-ocean text-white">
              Vedette
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Rupture de Stock</Badge>
            </div>
          )}
        </div>
        
        <div className="p-2 md:p-4 space-y-1.5 md:space-y-3">
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-ocean transition-colors leading-tight">
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
              {discount && (
                <span className="text-xs text-gray-400 line-through">
                  {price.toFixed(2)} DH
                </span>
              )}
              <span className="text-base md:text-lg font-bold text-ocean">
                {discountedPrice.toFixed(2)} DH
              </span>
              <span className="text-xs text-gray-500">
                / {unitType}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 pt-1">
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 min-w-[85px] md:min-w-[100px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1 || !inStock}
                className="h-7 w-7 p-0 rounded-md text-xs hover:bg-white"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="flex-1 text-center text-sm font-semibold px-1">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={!inStock}
                className="h-7 w-7 p-0 rounded-md text-xs hover:bg-white"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 h-8 md:h-9 text-xs md:text-sm font-medium px-2 md:px-3"
              size="sm"
            >
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">Ajouter</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ProductCard };