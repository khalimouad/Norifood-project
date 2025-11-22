import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/enhanced/AdminSidebar';
import { AdminDashboard } from '@/components/admin/enhanced/AdminDashboard';
import { EnhancedProductsManager } from '@/components/admin/enhanced/EnhancedProductsManager';
import { ProductForm } from '@/components/admin/enhanced/ProductForm';
import { TagsManager } from '@/components/admin/enhanced/TagsManager';
import { CategoriesManager } from '@/components/admin/enhanced/CategoriesManager';
import { OrdersManager } from '@/components/admin/enhanced/OrdersManager';
import { CustomersManager } from '@/components/admin/enhanced/CustomersManager';
import { PaymentsManager } from '@/components/admin/enhanced/PaymentsManager';
import { PromoCodesManager } from '@/components/admin/enhanced/PromoCodesManager';
import { BannersManager } from '@/components/admin/enhanced/BannersManager';
import { RecipesManager } from '@/components/admin/enhanced/RecipesManager';
import AdminRecipeForm from '@/pages/AdminRecipeForm';
import { SalesAnalytics } from '@/components/admin/enhanced/SalesAnalytics';
import { RevenueAnalytics } from '@/components/admin/enhanced/RevenueAnalytics';
import { ActivityAnalytics } from '@/components/admin/enhanced/ActivityAnalytics';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LogOut, ExternalLink } from 'lucide-react';

function AdminBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: { [key: string]: string } = {
    'admin': 'Admin',
    'products': 'Produits',
    'categories': 'Catégories',
    'orders': 'Commandes',
    'customers': 'Clients',
    'payments': 'Paiements',
    'promo-codes': 'Codes Promo',
    'banners': 'Bannières',
    'recipes': 'Recettes',
    'analytics': 'Analytics',
    'sales': 'Ventes',
    'revenue': 'Revenus',
    'activity': 'Activité',
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>Dashboard</span>
      {pathSegments.slice(1).map((segment, index) => (
        <div key={segment} className="flex items-center">
          <span className="mx-2">/</span>
          <span className={index === pathSegments.length - 2 ? 'text-foreground font-medium' : ''}>
            {breadcrumbMap[segment] || segment}
          </span>
        </div>
      ))}
    </nav>
  );
}

export default function AdminEnhanced() {
  const { isAdmin, loading } = useAdminAuth();
  const { signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <AdminBreadcrumb />
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle variant="icon" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open('/', '_blank')}
                className="hidden md:flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Voir le site
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Déconnexion</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<EnhancedProductsManager />} />
                <Route path="/products/new" element={<ProductForm />} />
                <Route path="/products/:id" element={<ProductForm />} />
                <Route path="/categories" element={<CategoriesManager />} />
                <Route path="/tags" element={<TagsManager />} />
                <Route path="/orders" element={<OrdersManager />} />
                <Route path="/customers" element={<CustomersManager />} />
                <Route path="/payments" element={<PaymentsManager />} />
                <Route path="/promo-codes" element={<PromoCodesManager />} />
                <Route path="/banners" element={<BannersManager />} />
                <Route path="/banners/new" element={<div className="p-6"><h2 className="text-xl font-semibold">Nouvelle bannière</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/banners/:id" element={<div className="p-6"><h2 className="text-xl font-semibold">Modifier la bannière</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/recipes" element={<RecipesManager />} />
                <Route path="/recipes/new" element={<AdminRecipeForm />} />
                <Route path="/recipes/:id" element={<AdminRecipeForm />} />
                <Route path="/analytics/sales" element={<SalesAnalytics />} />
                <Route path="/analytics/revenue" element={<RevenueAnalytics />} />
                <Route path="/analytics/activity" element={<ActivityAnalytics />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}