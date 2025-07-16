import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Truck, 
  Clock, 
  Phone,
  Mail,
  Download
} from "lucide-react";

const OrderConfirmation = () => {
  const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;
  const estimatedDelivery = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Commande Confirmée !
              </h1>
              <p className="text-gray-600 text-lg">
                Merci pour votre commande. Nous préparons vos produits avec soin.
              </p>
            </div>

            {/* Order Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Détails de la commande</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numéro de commande:</span>
                        <span className="font-medium">{orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <Badge className="bg-blue-100 text-blue-800">En préparation</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Livraison estimée</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-ocean" />
                        <span className="font-medium">{estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-ocean" />
                        <span className="text-gray-600">Créneau: 14h-17h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Confirmation par email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vérifiez votre boîte mail pour les détails
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Préparation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vos produits sont en cours de préparation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Livraison
                  </h3>
                  <p className="text-sm text-gray-600">
                    Livraison rapide à votre domicile
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Actions */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Besoin d'aide ?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Nous Contacter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger la Facture
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Vous pouvez suivre votre commande depuis votre espace client
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  Suivre ma Commande
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg">
                  Continuer mes Achats
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default OrderConfirmation;