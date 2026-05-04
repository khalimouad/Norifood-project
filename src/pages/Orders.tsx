import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Package, ArrowRight, Trash2, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  delivery_date: string | null;
  delivery_address: string;
  created_at: string;
  order_items?: Array<{ quantity: number; products?: { name: string } | null }>;
}

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-primary text-primary-foreground border-0';
    case 'cancelled':
      return 'bg-secondary text-muted-foreground border border-border';
    case 'pending':
      return 'bg-secondary text-foreground border border-border';
    default:
      return 'bg-primary/15 text-primary border border-primary/40';
  }
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    load();
  }, [user, authLoading, navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, payment_status, total_amount, delivery_date, delivery_address, created_at,
          order_items ( quantity, products ( name ) )
        `)
        .eq('customer_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders((data as Order[]) ?? []);
    } catch (e) {
      console.error('Error loading orders:', e);
      toast({ title: 'Erreur', description: 'Impossible de charger les commandes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: string) => {
    const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Commande annulée' });
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-32 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
          <div className="mb-6">
            <p className="nori-section-title text-primary mb-1">Mes commandes</p>
            <h1 className="text-2xl md:text-3xl font-extrabold">Historique</h1>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                <Package className="h-9 w-9 text-primary" />
              </div>
              <h2 className="text-xl font-extrabold mb-3">Aucune commande</h2>
              <p className="text-muted-foreground mb-8">
                Vos commandes apparaîtront ici dès la première validation.
              </p>
              <Link to="/products">
                <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm">
                  Voir le catalogue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const summary =
                  o.order_items
                    ?.map((it) => `${it.quantity}× ${it.products?.name ?? 'Produit'}`)
                    .join(' · ') ?? '';
                const canCancel = o.status === 'pending' || o.status === 'confirmed';
                return (
                  <article
                    key={o.id}
                    className="rounded-xl border border-border bg-card p-4 md:p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Commande #{o.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {summary || '—'}
                        </p>
                      </div>
                      <Badge className={`${statusBadge(o.status)} uppercase text-[10px] tracking-wider shrink-0`}>
                        {statusLabel[o.status] ?? o.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {new Date(o.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate">{o.delivery_address}</span>
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-primary tabular-nums">
                        {o.total_amount.toFixed(2)} €
                      </span>
                      {canCancel && (
                        <button
                          onClick={() => cancel(o.id)}
                          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Annuler
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Orders;
