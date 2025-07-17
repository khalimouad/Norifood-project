import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/enhanced/AdminSidebar';
import { AdminDashboard } from '@/components/admin/enhanced/AdminDashboard';
import { EnhancedProductsManager } from '@/components/admin/enhanced/EnhancedProductsManager';
import { CategoriesManager } from '@/components/admin/new/CategoriesManager';
import { OrdersManager } from '@/components/admin/new/OrdersManager';
import { CustomersManager } from '@/components/admin/new/CustomersManager';
import { PaymentsManager } from '@/components/admin/new/PaymentsManager';
import { PromoCodesManager } from '@/components/admin/new/PromoCodesManager';
import { BannersManager } from '@/components/admin/new/BannersManager';
import { RecipesManager } from '@/components/admin/new/RecipesManager';
import { ProductEdit } from '@/components/admin/new/ProductEdit';
import { BannerEdit } from '@/components/admin/new/BannerEdit';
import { useLocation } from 'react-router-dom';

function AdminBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: { [key: string]: string } = {
    'admin-enhanced': 'Admin',
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
              <div className="text-sm text-muted-foreground">
                Connecté en tant qu'administrateur
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto py-6">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<EnhancedProductsManager />} />
                <Route path="/products/new" element={<ProductEdit />} />
                <Route path="/products/:id" element={<ProductEdit />} />
                <Route path="/categories" element={<CategoriesManager />} />
                <Route path="/orders" element={<OrdersManager />} />
                <Route path="/customers" element={<CustomersManager />} />
                <Route path="/payments" element={<PaymentsManager />} />
                <Route path="/promo-codes" element={<PromoCodesManager />} />
                <Route path="/banners" element={<BannersManager />} />
                <Route path="/banners/new" element={<BannerEdit />} />
                <Route path="/banners/:id" element={<BannerEdit />} />
                <Route path="/recipes" element={<RecipesManager />} />
                <Route path="/analytics/sales" element={<div>Sales Analytics</div>} />
                <Route path="/analytics/revenue" element={<div>Revenue Analytics</div>} />
                <Route path="/analytics/activity" element={<div>Activity Analytics</div>} />
                <Route path="*" element={<Navigate to="/admin-enhanced" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}