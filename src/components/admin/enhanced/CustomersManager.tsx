import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable, StatusBadge } from './EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, ShoppingCart } from 'lucide-react';

interface CustomerData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  postal_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    orders: number;
  };
  _sum?: {
    order_total: number;
  };
}

export function CustomersManager() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // First get customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Then get order statistics for each customer
      const customersWithStats = await Promise.all(
        (customersData || []).map(async (customer) => {
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('customer_id', customer.id);

          if (ordersError) {
            console.error('Error fetching orders for customer:', customer.id, ordersError);
            return {
              ...customer,
              _count: { orders: 0 },
              _sum: { order_total: 0 }
            };
          }

          const orderCount = orders?.length || 0;
          const orderTotal = orders?.reduce((sum, order) => sum + parseFloat(String(order.total_amount)), 0) || 0;

          return {
            ...customer,
            _count: { orders: orderCount },
            _sum: { order_total: orderTotal }
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (customer: CustomerData) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          is_active: !customer.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: "Client mis à jour",
        description: `Le client a été ${customer.is_active ? 'désactivé' : 'activé'} avec succès`,
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le client",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: 'customer_info',
      label: 'Client',
      sortable: true,
      render: (value: any, row: CustomerData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {row.first_name && row.last_name 
                ? `${row.first_name} ${row.last_name}`
                : 'Nom non renseigné'
              }
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {row.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {row.email}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {row.phone}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'address_info',
      label: 'Adresse',
      render: (value: any, row: CustomerData) => (
        <div className="text-sm">
          {row.address && (
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{row.address}</span>
            </div>
          )}
          {(row.city || row.postal_code) && (
            <p className="text-muted-foreground">
              {row.postal_code} {row.city}
            </p>
          )}
          {!row.address && !row.city && !row.postal_code && (
            <span className="text-muted-foreground">Non renseignée</span>
          )}
        </div>
      ),
    },
    {
      key: 'order_stats',
      label: 'Commandes',
      sortable: true,
      render: (value: any, row: CustomerData) => (
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center mb-1">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row._count?.orders || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {(row._sum?.order_total || 0).toFixed(2)} MAD
          </p>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      filterable: true,
      filterOptions: [
        { value: 'true', label: 'Actif' },
        { value: 'false', label: 'Inactif' },
      ],
      render: (value: boolean) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'created_at',
      label: 'Inscrit le',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {new Date(value).toLocaleDateString('fr-FR')}
          </span>
        </div>
      ),
    },
  ];

  // Custom actions for customers
  const handleEdit = (customer: CustomerData) => {
    // For now, just toggle status - could expand to full edit form
    handleToggleStatus(customer);
  };

  return (
    <div className="space-y-6">
      <EnhancedTable
        title="Gestion des clients"
        description="Gérez votre base de clients"
        columns={columns}
        data={customers}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={fetchCustomers}
        searchPlaceholder="Rechercher un client..."
        emptyMessage="Aucun client trouvé"
        exportFileName="clients"
      />
    </div>
  );
}