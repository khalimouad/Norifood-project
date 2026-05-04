import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  ArrowRight,
  Percent,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  activePromoCodes: number;
  recentOrders: any[];
  topProducts: any[];
  ordersByStatus: any[];
  salesData: any[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    activePromoCodes: 0,
    recentOrders: [],
    topProducts: [],
    ordersByStatus: [],
    salesData: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch basic stats
      const [productsResult, customersResult, ordersResult, promoCodesResult] = await Promise.all([
        supabase.from('products').select('*, stock_quantity', { count: 'exact' }),
        supabase.from('customers').select('*', { count: 'exact' }),
        supabase.from('orders').select('*, total_amount, status'),
        supabase.from('promo_codes').select('*', { count: 'exact' }).eq('is_active', true),
      ]);

      // Calculate stats
      const totalProducts = productsResult.count || 0;
      const totalCustomers = customersResult.count || 0;
      const totalOrders = ordersResult.count || 0;
      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + parseFloat(String(order.total_amount) || '0'), 0) || 0;
      const pendingOrders = ordersResult.data?.filter(order => order.status === 'pending').length || 0;
      const lowStockProducts = productsResult.data?.filter(product => product.stock_quantity < 5).length || 0;
      const activePromoCodes = promoCodesResult.count || 0;

      // Get recent orders
      const recentOrdersResult = await supabase
        .from('orders')
        .select('*, customers(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get top products (mock data for now)
      const topProducts = productsResult.data?.slice(0, 5).map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: parseFloat(String(product.base_price)) * (Math.floor(Math.random() * 100) + 10),
      })) || [];

      // Orders by status
      const ordersByStatus = [
        { name: 'En attente', value: pendingOrders, color: '#F59E0B' },
        { name: 'Confirmé', value: ordersResult.data?.filter(o => o.status === 'confirmed').length || 0, color: '#3B82F6' },
        { name: 'Expédié', value: ordersResult.data?.filter(o => o.status === 'shipped').length || 0, color: '#10B981' },
        { name: 'Livré', value: ordersResult.data?.filter(o => o.status === 'delivered').length || 0, color: '#10B981' },
        { name: 'Annulé', value: ordersResult.data?.filter(o => o.status === 'cancelled').length || 0, color: '#EF4444' },
      ];

      // Sales data (mock for last 7 days)
      const salesData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'short' }),
        sales: Math.floor(Math.random() * 1000) + 500,
        orders: Math.floor(Math.random() * 50) + 10,
      })).reverse();

      setStats({
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        activePromoCodes,
        recentOrders: recentOrdersResult.data || [],
        topProducts,
        ordersByStatus,
        salesData,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Produits",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 ce mois",
      trend: "up"
    },
    {
      title: "Clients",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12 ce mois",
      trend: "up"
    },
    {
      title: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8 aujourd'hui",
      trend: "up"
    },
    {
      title: "Chiffre d'affaires",
      value: `${((stats.totalRevenue) ?? 0).toFixed(2)} MAD`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+15% ce mois",
      trend: "up"
    },
  ];

  const alertCards = [
    {
      title: "Commandes en attente",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      urgent: stats.pendingOrders > 5
    },
    {
      title: "Stock faible",
      value: stats.lowStockProducts,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      urgent: stats.lowStockProducts > 0
    },
    {
      title: "Codes promo actifs",
      value: stats.activePromoCodes,
      icon: Percent,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      urgent: false
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre boutique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Voir le site
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {card.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-muted-foreground">{card.change}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alertCards.map((card) => (
          <Card key={card.title} className={`relative ${card.urgent ? 'border-red-200 bg-red-50/50' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                {card.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes (7 derniers jours)</CardTitle>
            <CardDescription>Évolution des ventes quotidiennes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes par statut</CardTitle>
            <CardDescription>Répartition des commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {order.customers?.first_name} {order.customers?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{parseFloat(String(order.total_amount)).toFixed(2)} MAD</p>
                    <Badge variant={order.status === 'pending' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produits populaires</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-green-700">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{((product.revenue) ?? 0).toFixed(2)} MAD</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}