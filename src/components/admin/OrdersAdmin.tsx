import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Package, Search, Grid, List } from "lucide-react";

interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  delivery_address: string;
  delivery_phone: string;
  delivery_date: string;
  delivery_time_slot: string;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `*, customers(first_name, last_name, email), order_items(*, products(name))`,
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders((data ?? []) as any);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      toast({
        title: 'Succès',
        description: 'Statut de la commande mis à jour',
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Commandes ({filteredOrders.length})</h2>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des commandes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="preparing">En préparation</SelectItem>
            <SelectItem value="ready">Prête</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Commande #{order.id.substring(0, 8)}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Badge variant="outline">
                      {order.payment_status === 'paid' ? 'Payé' : 'Non payé'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Client:</strong> {order.guest_name || 'Client enregistré'}</p>
                      <p><strong>Téléphone:</strong> {order.delivery_phone}</p>
                      <p><strong>Adresse:</strong> {order.delivery_address}</p>
                      {order.delivery_date && (
                        <p><strong>Date de livraison:</strong> {order.delivery_date}</p>
                      )}
                      {order.delivery_time_slot && (
                        <p><strong>Créneau:</strong> {order.delivery_time_slot}</p>
                      )}
                    </div>
                    
                    <div>
                      <p><strong>Montant:</strong> {order.total_amount} DH</p>
                      <p><strong>Sous-total:</strong> {order.subtotal} DH</p>
                      <p><strong>Livraison:</strong> {order.delivery_fee} DH</p>
                      <p><strong>Paiement:</strong> {order.payment_method}</p>
                      <p><strong>Créée le:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {order.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-1">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        Confirmer
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                      >
                        Préparer
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                      >
                        Prête
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                      >
                        Livrée
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};