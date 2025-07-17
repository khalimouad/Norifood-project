import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Eye, MousePointer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ActivityAnalytics() {
  const [activityData, setActivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      // Fetch activity data (mock data for now)
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('created_at')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('created_at')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const todayCustomers = customers?.filter(customer => 
        new Date(customer.created_at) >= today
      ).length || 0;

      const todayOrders = orders?.filter(order => 
        new Date(order.created_at) >= today
      ).length || 0;

      setActivityData({
        activeUsers: todayCustomers,
        pageViews: 1250, // Mock data
        bounceRate: 35.2, // Mock data
        avgSessionDuration: 245, // Mock data in seconds
        todayOrders,
        recentActivity: [
          { type: 'order', message: 'Nouvelle commande #1234', time: '2 min' },
          { type: 'customer', message: 'Nouveau client inscrit', time: '5 min' },
          { type: 'product', message: 'Produit mis à jour', time: '12 min' },
        ]
      });
    } catch (error) {
      console.error('Error fetching activity data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'activité",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!activityData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics - Activité</h2>
        <p className="text-muted-foreground">Suivi de l'activité et engagement utilisateur</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityData.activeUsers}</div>
            <div className="text-xs text-muted-foreground">Aujourd'hui</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityData.pageViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Aujourd'hui</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de rebond</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityData.bounceRate}%</div>
            <div className="text-xs text-muted-foreground">Aujourd'hui</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Session moyenne</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(activityData.avgSessionDuration / 60)}m {activityData.avgSessionDuration % 60}s
            </div>
            <div className="text-xs text-muted-foreground">Durée moyenne</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityData.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{activity.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trafic par heure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground">Graphique du trafic (à implémenter)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}