import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Tag,
  Truck,
  Clock,
  Shield
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  weight?: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Saumon Atlantique Frais",
      price: 85,
      quantity: 2,
      unit: "kg",
      image: "/placeholder.svg",
      weight: 1.5
    },
    {
      id: "2",
      name: "Crevettes Royales",
      price: 120,
      quantity: 1,
      unit: "kg",
      image: "/placeholder.svg",
      weight: 0.5
    },
    {
      id: "3",
      name: "Dorade Royale",
      price: 95,
      quantity: 3,
      unit: "pièce",
      image: "/placeholder.svg"
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const { toast } = useToast();

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de votre panier",
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "fresh10") {
      setAppliedPromo("FRESH10");
      toast({
        title: "Code promo appliqué !",
        description: "10% de réduction sur votre commande",
      });
    } else {
      toast({
        title: "Code promo invalide",
        description: "Veuillez vérifier votre code promo",
        variant: "destructive"
      });
    }
    setPromoCode("");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo === "FRESH10" ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 200 ? 0 : 25;
  const total = subtotal - discount + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8">
                <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Votre Panier est Vide
                </h1>
                <p className="text-gray-600 mb-8">
                  Découvrez nos produits frais et commencez vos achats
                </p>
              </div>
              <Button size="lg" className="w-full">
                <ArrowRight className="h-5 w-5 mr-2" />
                Découvrir nos Produits
              </Button>
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
              <ShoppingBag className="h-8 w-8 text-ocean" />
              <h1 className="text-3xl font-bold text-gray-900">
                Mon Panier
              </h1>
            </div>
            <p className="text-gray-600">
              {cartItems.length} article{cartItems.length > 1 ? "s" : ""} dans votre panier
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-ocean">
                            {item.price} DH
                          </span>
                          <span className="text-sm text-gray-500">
                            / {item.unit}
                          </span>
                          {item.weight && (
                            <Badge variant="secondary" className="text-xs">
                              {item.weight} kg
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">
                              {(item.price * item.quantity).toFixed(2)} DH
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Promo Code */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-ocean" />
                    Code Promo
                  </h3>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-800">Code appliqué: {appliedPromo}</p>
                        <p className="text-sm text-green-600">10% de réduction</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppliedPromo(null)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Retirer
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Entrez votre code promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={applyPromoCode} disabled={!promoCode}>
                        Appliquer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Résumé de la Commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} DH</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction (FRESH10)</span>
                        <span>-{discount.toFixed(2)} DH</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{deliveryFee === 0 ? "Gratuite" : `${deliveryFee} DH`}</span>
                    </div>
                    {subtotal < 200 && (
                      <p className="text-sm text-gray-500">
                        Livraison gratuite à partir de 200 DH
                      </p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)} DH</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Passer la Commande
                  </Button>

                  <Button variant="outline" size="lg" className="w-full">
                    Continuer mes Achats
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Informations de Livraison
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Truck className="h-5 w-5 text-ocean" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Livraison Express</p>
                        <p className="text-xs text-gray-600">Même jour ou 24h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-ocean" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Créneau Flexible</p>
                        <p className="text-xs text-gray-600">Choix de l'heure</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-ocean" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Fraîcheur Garantie</p>
                        <p className="text-xs text-gray-600">Chaîne du froid respectée</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="text-center space-y-2">
                <div className="flex justify-center gap-4">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Paiement Sécurisé
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Truck className="h-3 w-3 mr-1" />
                    Livraison Rapide
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  Satisfait ou remboursé sous 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Cart;