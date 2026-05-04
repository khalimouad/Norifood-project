import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable, StatusBadge } from './EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShoppingCart, User, Calendar, MapPin } from 'lucide-react';

interface OrderData {
  id: string;
  customer_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  delivery_date?: string;
  delivery_time_slot?: string;
  delivery_address: string;
  delivery_phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items?: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: {
      name: string;
    };
  }>;
}

const orderStatuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'ready', label: 'Prête' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const paymentStatuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'failed', label: 'Échec' },
  { value: 'refunded', label: 'Remboursée' },
];

export function OrdersManager() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    payment_status: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            email
          ),
          order_items (
            id,
            quantity,
            unit_price,
            total_price,
            products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: OrderData) => {
    setSelectedOrder(order);
    setStatusUpdate({
      status: order.status,
      payment_status: order.payment_status
    });
    setIsDetailOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: statusUpdate.status,
          payment_status: statusUpdate.payment_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast({
        title: "Commande mise à jour",
        description: "Le statut de la commande a été modifié avec succès",
      });

      setIsDetailOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => (
        <span className="font-mono text-sm">#{value.slice(0, 8)}</span>
      ),
    },
    {
      key: 'customer_info',
      label: 'Client',
      render: (value: any, row: OrderData) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">
              {row.customers 
                ? `${row.customers.first_name} ${row.customers.last_name}`
                : row.guest_name || 'Client invité'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {row.customers?.email || row.guest_email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'total_amount',
      label: 'Total',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{((value) ?? 0).toFixed(2)} MAD</span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      filterable: true,
      filterOptions: orderStatuses,
      render: (value: string) => {
        const status = orderStatuses.find(s => s.value === value);
        return (
          <Badge className={getStatusColor(value)}>
            {status?.label || value}
          </Badge>
        );
      },
    },
    {
      key: 'payment_status',
      label: 'Paiement',
      filterable: true,
      filterOptions: paymentStatuses,
      render: (value: string) => {
        const status = paymentStatuses.find(s => s.value === value);
        return (
          <Badge className={getPaymentStatusColor(value)}>
            {status?.label || value}
          </Badge>
        );
      },
    },
    {
      key: 'delivery_date',
      label: 'Livraison',
      render: (value: string, row: OrderData) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            {value && (
              <p className="text-sm">
                {new Date(value).toLocaleDateString('fr-FR')}
              </p>
            )}
            {row.delivery_time_slot && (
              <p className="text-xs text-muted-foreground">
                {row.delivery_time_slot}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Créé le',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <EnhancedTable
        title="Gestion des commandes"
        description="Suivez et gérez toutes les commandes"
        columns={columns}
        data={orders}
        loading={loading}
        onView={handleView}
        onRefresh={fetchOrders}
        searchPlaceholder="Rechercher une commande..."
        emptyMessage="Aucune commande trouvée"
        exportFileName="commandes"
      />

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
            <DialogDescription>
              Commande créée le {selectedOrder && new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status Update */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut de la commande</Label>
                  <Select
                    value={statusUpdate.status}
                    onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Statut du paiement</Label>
                  <Select
                    value={statusUpdate.payment_status}
                    onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, payment_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations client
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {selectedOrder.customers 
                      ? `${selectedOrder.customers.first_name} ${selectedOrder.customers.last_name}`
                      : selectedOrder.guest_name || 'Client invité'
                    }</p>
                    <p><strong>Email:</strong> {selectedOrder.customers?.email || selectedOrder.guest_email}</p>
                    <p><strong>Téléphone:</strong> {selectedOrder.delivery_phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Livraison
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Adresse:</strong> {selectedOrder.delivery_address}</p>
                    {selectedOrder.delivery_date && (
                      <p><strong>Date:</strong> {new Date(selectedOrder.delivery_date).toLocaleDateString('fr-FR')}</p>
                    )}
                    {selectedOrder.delivery_time_slot && (
                      <p><strong>Créneau:</strong> {selectedOrder.delivery_time_slot}</p>
                    )}
                    <p><strong>Méthode de paiement:</strong> {selectedOrder.payment_method}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Articles commandés
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Produit</th>
                        <th className="text-right p-3">Quantité</th>
                        <th className="text-right p-3">Prix unitaire</th>
                        <th className="text-right p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items?.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.products?.name}</td>
                          <td className="text-right p-3">{item.quantity}</td>
                          <td className="text-right p-3">{((item.unit_price) ?? 0).toFixed(2)} MAD</td>
                          <td className="text-right p-3 font-medium">{((item.total_price) ?? 0).toFixed(2)} MAD</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted">
                      <tr>
                        <td colSpan={3} className="text-right p-3 font-medium">Sous-total:</td>
                        <td className="text-right p-3 font-medium">{((selectedOrder.subtotal) ?? 0).toFixed(2)} MAD</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right p-3 font-medium">Frais de livraison:</td>
                        <td className="text-right p-3 font-medium">{((selectedOrder.delivery_fee) ?? 0).toFixed(2)} MAD</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right p-3 font-bold">Total:</td>
                        <td className="text-right p-3 font-bold text-lg">{((selectedOrder.total_amount) ?? 0).toFixed(2)} MAD</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Notes</h3>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={handleStatusUpdate}>
                  Mettre à jour
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}