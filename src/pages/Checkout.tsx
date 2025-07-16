import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { 
  CreditCard, 
  MapPin, 
  Clock, 
  Truck,
  Lock,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
    paymentMethod: "card"
  });

  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 200 ? 0 : 25;
  const total = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été passée avec succès",
      });
      
      navigate("/order-confirmation");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finaliser ma Commande
            </h1>
            <p className="text-gray-600">
              Quelques informations pour livrer votre commande
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-ocean" />
                      Informations de Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-ocean" />
                      Adresse de Livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse complète *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Numéro, rue, appartement..."
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code Postal *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-ocean" />
                      Options de Livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryDate">Date souhaitée</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryTime">Créneau horaire</Label>
                        <select
                          id="deliveryTime"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={formData.deliveryTime}
                          onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                        >
                          <option value="">Sélectionner un créneau</option>
                          <option value="morning">Matin (9h-12h)</option>
                          <option value="afternoon">Après-midi (14h-17h)</option>
                          <option value="evening">Soir (18h-21h)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Instructions particulières..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-ocean" />
                      Méthode de Paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                          className="text-ocean"
                        />
                        <CreditCard className="h-5 w-5 text-ocean" />
                        <div>
                          <p className="font-medium">Carte bancaire</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-800">Sécurisé</Badge>
                      </label>
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                          className="text-ocean"
                        />
                        <Truck className="h-5 w-5 text-ocean" />
                        <div>
                          <p className="font-medium">Paiement à la livraison</p>
                          <p className="text-sm text-gray-600">Espèces ou carte</p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Récapitulatif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {item.price} DH
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.price * item.quantity).toFixed(2)} DH
                        </p>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{subtotal.toFixed(2)} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{deliveryFee === 0 ? "Gratuite" : `${deliveryFee} DH`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{total.toFixed(2)} DH</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Confirmer la Commande
                    </>
                  )}
                </Button>

                <div className="text-center space-y-2">
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Lock className="h-3 w-3 mr-1" />
                      Paiement Sécurisé
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    Vos données sont protégées et chiffrées
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Checkout;