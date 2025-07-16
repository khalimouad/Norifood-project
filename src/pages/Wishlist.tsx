import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { 
  Heart, 
  ShoppingCart,
  Trash2,
  Plus
} from "lucide-react";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      unitType: item.unitType as string
    });
    
    toast({
      title: "Produit ajouté !",
      description: `${item.name} ajouté au panier`
    });
  };

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Produit retiré",
      description: `${name} retiré de vos favoris`
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8">
                <Heart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Votre Liste de Souhaits est Vide
                </h1>
                <p className="text-gray-600 mb-8">
                  Découvrez nos produits et ajoutez vos favoris ici
                </p>
              </div>
              <Link to="/products">
                <Button size="lg" className="w-full">
                  <Plus className="h-5 w-5 mr-2" />
                  Découvrir nos Produits
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-coral" />
              <h1 className="text-3xl font-bold text-gray-900">
                Mes Favoris
              </h1>
            </div>
            <p className="text-gray-600">
              {items.length} produit{items.length > 1 ? "s" : ""} dans vos favoris
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                    >
                      <Heart className="h-4 w-4 text-coral fill-coral" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-ocean">
                        {item.price} DH
                      </span>
                      <span className="text-sm text-gray-500">
                        / {item.unitType}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Continuer mes Achats
              </Button>
            </Link>
            <Link to="/cart">
              <Button size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Voir mon Panier
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Wishlist;