import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus, Sparkles, Star, Flame } from 'lucide-react';
import placeholderImage from '@/assets/placeholder-product.jpg';

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

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  unitType,
  inStock = true,
  featured = false,
  discount
}: ProductCardProps) => {
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
    <Card className="group glovo-card glass-card overflow-hidden fade-in rounded-2xl">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link to={`/product/${id}`}>
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
              <img
                src={image || placeholderImage}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Glovo-style gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-glovo-purple/80 via-glovo-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discount && (
              <Badge className="bg-gradient-to-r from-glovo-orange to-glovo-pink text-white shadow-lg shadow-glovo-orange/30 font-bold text-xs px-2.5 py-1 ring-1 ring-white/40">
                -{discount}%
              </Badge>
            )}
            {featured && (
              <Badge className="bg-gradient-to-r from-glovo-purple to-glovo-green text-white shadow-lg shadow-glovo-purple/30 font-bold text-xs px-2.5 py-1 ring-1 ring-white/40">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Top
              </Badge>
            )}
          </div>

          {!inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300">
              <Badge variant="destructive" className="text-sm px-4 py-2 rounded-full">
                Rupture
              </Badge>
            </div>
          )}

          {/* Quick add button on hover */}
          <div className="absolute bottom-3 right-3 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <Button
              size="icon"
              className="h-11 w-11 rounded-full bg-gradient-to-br from-glovo-purple to-glovo-orange text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 button-press"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-3 md:p-4 space-y-2">
          <Link to={`/product/${id}`}>
            <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 hover:text-glovo-purple transition-colors leading-tight min-h-[2.5rem]">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-1.5">
              {discount && (
                <span className="text-xs text-muted-foreground line-through font-medium">
                  {price.toFixed(2)} DH
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg md:text-xl font-extrabold text-glovo-purple">
                  {discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">DH</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">/ {unitType}</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center bg-muted/80 rounded-xl p-0.5 min-w-[90px] md:min-w-[100px] border border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1 || !inStock}
                className="h-7 w-7 p-0 rounded-lg text-xs hover:bg-glovo-purple hover:text-white icon-bounce focus-ring"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="flex-1 text-center text-sm font-semibold px-1 text-foreground">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={!inStock}
                className="h-7 w-7 p-0 rounded-lg text-xs hover:bg-glovo-purple hover:text-white icon-bounce focus-ring"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              size="sm"
              variant="cart"
              className="flex-1 h-9 md:h-10 text-xs md:text-sm font-medium px-3 bg-gradient-to-r from-glovo-purple to-glovo-orange hover:from-glovo-purple/90 hover:to-glovo-orange/90 text-white shadow-md hover:shadow-lg transition-all duration-300 button-press focus-ring rounded-xl"
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
