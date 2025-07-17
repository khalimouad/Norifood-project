import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  order_id: string;
  orders?: {
    customer_id: string;
    customers?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export function PaymentsManager() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          orders (
            customer_id,
            customers (
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completed': { label: 'Terminé', variant: 'default' as const },
      'pending': { label: 'En attente', variant: 'secondary' as const },
      'failed': { label: 'Échoué', variant: 'destructive' as const },
      'refunded': { label: 'Remboursé', variant: 'outline' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const columns = [
    {
      key: 'transaction_id',
      label: 'ID Transaction',
      render: (payment: PaymentTransaction) => (
        <span className="font-mono text-sm">{payment.transaction_id || 'N/A'}</span>
      )
    },
    {
      key: 'customer',
      label: 'Client',
      render: (payment: PaymentTransaction) => {
        const customer = payment.orders?.customers;
        return customer ? (
          <div>
            <div className="font-medium">{customer.first_name} {customer.last_name}</div>
            <div className="text-sm text-muted-foreground">{customer.email}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">Client invité</span>
        );
      }
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (payment: PaymentTransaction) => (
        <span className="font-medium">
          {payment.amount.toFixed(2)} {payment.currency}
        </span>
      )
    },
    {
      key: 'payment_method',
      label: 'Méthode',
      render: (payment: PaymentTransaction) => (
        <Badge variant="outline">{payment.payment_method}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (payment: PaymentTransaction) => getStatusBadge(payment.status)
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (payment: PaymentTransaction) => (
        <span className="text-sm">
          {new Date(payment.created_at).toLocaleString('fr-FR')}
        </span>
      )
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.orders?.customers?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.orders?.customers?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.orders?.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Paiements</h2>
          <p className="text-muted-foreground">Gérer les transactions de paiement</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par transaction, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <EnhancedTable
        title="Paiements"
        description="Gérer les transactions de paiement"
        data={filteredPayments}
        columns={columns}
        loading={loading}
        onRefresh={fetchPayments}
      />
    </div>
  );
}