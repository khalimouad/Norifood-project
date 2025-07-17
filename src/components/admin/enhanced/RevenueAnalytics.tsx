import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      // Fetch revenue data
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const thisMonthRevenue = orders?.filter(order => 
        new Date(order.created_at) >= thisMonth && order.status === 'completed'
      ).reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      const lastMonthRevenue = orders?.filter(order => 
        new Date(order.created_at) >= lastMonth && 
        new Date(order.created_at) < thisMonth && 
        order.status === 'completed'
      ).reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      const growth = lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      setRevenueData({
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth,
        target: 50000, // Mock target
        dailyAverage: thisMonthRevenue / new Date().getDate()
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de revenus",
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

  if (!revenueData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics - Revenus</h2>
        <p className="text-muted-foreground">Analyse des revenus et performance financière</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.thisMonth.toFixed(2)} MAD</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueData.growth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(revenueData.growth).toFixed(1)}% vs mois dernier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenus mois dernier</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.lastMonth.toFixed(2)} MAD</div>
            <div className="text-xs text-muted-foreground">Mois précédent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Objectif mensuel</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.target.toFixed(2)} MAD</div>
            <div className="text-xs text-muted-foreground">
              {((revenueData.thisMonth / revenueData.target) * 100).toFixed(1)}% atteint
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Moyenne quotidienne</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.dailyAverage.toFixed(2)} MAD</div>
            <div className="text-xs text-muted-foreground">Par jour ce mois</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">Graphique des revenus (à implémenter)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}