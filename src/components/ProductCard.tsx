import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

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
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
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

  const handleWishlistToggle = () => {
    const wishlistItem = { id, name, price, image, unitType };
    
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast({
        title: "Retiré des favoris",
        description: `${name} retiré de vos favoris`
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Ajouté aux favoris",
        description: `${name} ajouté à vos favoris`
      });
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
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
            style={{ right: featured ? '60px' : '8px' }}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isInWishlist(id) ? 'text-coral fill-coral' : 'text-gray-600 hover:text-coral'
              }`} 
            />
          </button>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Rupture de Stock</Badge>
            </div>
          )}
        </div>
        
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-ocean transition-colors">
              {name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2">
            {discount && (
              <span className="text-xs text-gray-400 line-through">
                {price.toFixed(2)} DH
              </span>
            )}
            <span className="text-sm md:text-lg font-bold text-ocean">
              {discountedPrice.toFixed(2)} DH
            </span>
            <span className="text-xs text-gray-500">
              / {unitType}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 rounded-full p-1 flex-1 max-w-[100px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1 || !inStock}
                className="h-7 w-7 p-0 rounded-full text-xs"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="flex-1 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={!inStock}
                className="h-7 w-7 p-0 rounded-full text-xs"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 h-8 text-xs"
              size="sm"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ProductCard };