import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  order_id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  gateway_response: any;
  created_at: string;
}

export const PaymentsAdmin = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-payments', {
        method: 'GET'
      });
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'completed': return 'Complété';
      case 'failed': return 'Échoué';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Paiements ({payments.length})</h2>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      Paiement #{payment.id.substring(0, 8)}
                    </h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Commande:</strong> #{payment.order_id.substring(0, 8)}</p>
                      <p><strong>Méthode:</strong> {payment.payment_method}</p>
                      <p><strong>Montant:</strong> {payment.amount} {payment.currency}</p>
                    </div>
                    
                    <div>
                      <p><strong>Transaction ID:</strong> {payment.transaction_id || 'N/A'}</p>
                      <p><strong>Date:</strong> {new Date(payment.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {payment.gateway_response && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p><strong>Réponse gateway:</strong></p>
                      <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(payment.gateway_response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};