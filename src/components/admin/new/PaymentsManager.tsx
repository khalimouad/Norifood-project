import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type PaymentTransaction = Tables<'payment_transactions'>;

export function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paiements',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return 'Inconnu';
    }
  };

  const formatAmount = (amount: number, currency: string = 'MAD') => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paiements</h2>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            Total: {payments.reduce((sum, p) => sum + p.amount, 0)} MAD
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction #{payment.transaction_id || payment.id.slice(0, 8)}
                  <Badge variant={getStatusColor(payment.status)}>
                    {getStatusLabel(payment.status)}
                  </Badge>
                </CardTitle>
                <div className="text-lg font-semibold">
                  {formatAmount(payment.amount, payment.currency || 'MAD')}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Méthode de paiement:</strong> {payment.payment_method}
                </div>
                <div>
                  <strong>Devise:</strong> {payment.currency || 'MAD'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <strong>Date:</strong> {new Date(payment.created_at || '').toLocaleDateString()}
                </div>
                <div>
                  <strong>Commande:</strong> {payment.order_id.slice(0, 8)}...
                </div>
              </div>
              
              {payment.gateway_response && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <strong className="text-sm">Réponse de la passerelle:</strong>
                  <pre className="text-xs mt-1 overflow-x-auto">
                    {JSON.stringify(payment.gateway_response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {payments.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun paiement trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}