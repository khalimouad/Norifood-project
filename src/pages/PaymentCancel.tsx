import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clean up any pending order data
    localStorage.removeItem('pendingOrder');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Cancel Message */}
            <div className="text-center mb-8">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Paiement Annulé
              </h1>
              <p className="text-gray-600">
                Votre paiement a été annulé. Aucun montant n'a été débité.
              </p>
            </div>

            {/* Information Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Que s'est-il passé ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">Paiement interrompu</h3>
                  <p className="text-yellow-800 text-sm">
                    Vous avez annulé le processus de paiement ou la transaction a été interrompue.
                    Vos articles sont toujours dans votre panier.
                  </p>
                </div>

                {orderId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">Numéro de commande annulée</p>
                      <p className="text-gray-900">{orderId}</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Que faire maintenant ?</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Retournez à votre panier pour modifier votre commande</li>
                    <li>• Essayez à nouveau le processus de paiement</li>
                    <li>• Contactez notre service client si vous rencontrez des difficultés</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Continuer mes achats
              </Button>
              <Button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Retour au panier
              </Button>
            </div>

            {/* Support Information */}
            <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Si vous rencontrez des problèmes avec le paiement, n'hésitez pas à nous contacter.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/contact')}>
                Contacter le support
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default PaymentCancel;