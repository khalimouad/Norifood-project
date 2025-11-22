import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable, StatusBadge } from './EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, ShoppingCart, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const [submitting, setSubmitting] = useState(false);
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

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate: at least one of email or phone is required
    if (!formData.email && !formData.phone) {
      toast({
        title: "Erreur",
        description: "Email ou téléphone est requis",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password) {
      toast({
        title: "Erreur",
        description: "Le mot de passe est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase.functions.invoke('create-customer-with-auth', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès",
      });

      setDialogOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        city: '',
        postal_code: '',
      });
      fetchCustomers();
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le client",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Custom actions for customers
  const handleEdit = (customer: CustomerData) => {
    // For now, just toggle status - could expand to full edit form
    handleToggleStatus(customer);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des clients</h2>
          <p className="text-muted-foreground">Gérez votre base de clients</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email {!formData.phone && '*'}</Label>
                <Input
                  id="email"
                  type="email"
                  required={!formData.phone}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
                <p className="text-xs text-muted-foreground">Email ou téléphone requis</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone {!formData.email && '*'}</Label>
                <Input
                  id="phone"
                  type="tel"
                  required={!formData.email}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+212 6XX XXX XXX"
                />
                <p className="text-xs text-muted-foreground">Email ou téléphone requis</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 caractères"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ville"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="Code postal"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Création...' : 'Créer le client'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <EnhancedTable
        title=""
        description=""
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