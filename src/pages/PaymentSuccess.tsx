import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const status = searchParams.get('status');

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      // Verify payment with CMI
      const { data, error } = await supabase.functions.invoke('cmi-payment', {
        body: {
          action: 'verify_payment',
          orderId: orderId,
          transactionId: transactionId,
          status: status
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.verified) {
        // Get order details from localStorage
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          setOrderDetails(orderData);
          localStorage.removeItem('pendingOrder');
        }

        toast({
          title: "Paiement confirmé !",
          description: "Votre commande a été payée avec succès",
        });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le paiement",
        variant: "destructive"
      });
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du paiement...</p>
          </div>
        </div>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Paiement Confirmé !
              </h1>
              <p className="text-gray-600">
                Votre commande a été payée avec succès via CMI
              </p>
            </div>

            {/* Order Details */}
            {orderDetails && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Détails de la Commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Numéro de commande</p>
                        <p className="text-gray-900">{orderId}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Montant total</p>
                        <p className="text-gray-900 font-semibold">{orderDetails.total?.toFixed(2)} DH</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Mode de paiement</p>
                        <p className="text-gray-900">CMI Paiement</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Statut</p>
                        <p className="text-green-600 font-semibold">Payé</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Articles commandés</h3>
                    {orderDetails.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{(item.price * item.quantity).toFixed(2)} DH</p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Livraison
                    </h3>
                    <p className="text-blue-800 text-sm">
                      Votre commande sera livrée à l'adresse indiquée dans les 24-48h.
                      Vous recevrez un SMS de confirmation avec les détails de livraison.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                className="flex items-center gap-2"
              >
                Continuer mes achats
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                Voir mes commandes
                <ArrowRight className="h-4 w-4" />
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

export default PaymentSuccess;