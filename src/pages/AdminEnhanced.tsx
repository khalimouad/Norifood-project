import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminSidebar } from '@/components/admin/enhanced/AdminSidebar';
import { AdminDashboard } from '@/components/admin/enhanced/AdminDashboard';
import { EnhancedProductsManager } from '@/components/admin/enhanced/EnhancedProductsManager';
import { useLocation } from 'react-router-dom';

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
                <Route path="/products/new" element={<div className="p-6"><h2 className="text-xl font-semibold">Nouveau produit</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/products/:id" element={<div className="p-6"><h2 className="text-xl font-semibold">Modifier le produit</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/categories" element={<div className="p-6"><h2 className="text-xl font-semibold">Catégories</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/orders" element={<div className="p-6"><h2 className="text-xl font-semibold">Commandes</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/customers" element={<div className="p-6"><h2 className="text-xl font-semibold">Clients</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/payments" element={<div className="p-6"><h2 className="text-xl font-semibold">Paiements</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/promo-codes" element={<div className="p-6"><h2 className="text-xl font-semibold">Codes Promo</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/banners" element={<div className="p-6"><h2 className="text-xl font-semibold">Bannières</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/banners/new" element={<div className="p-6"><h2 className="text-xl font-semibold">Nouvelle bannière</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/banners/:id" element={<div className="p-6"><h2 className="text-xl font-semibold">Modifier la bannière</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/recipes" element={<div className="p-6"><h2 className="text-xl font-semibold">Recettes</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/analytics/sales" element={<div className="p-6"><h2 className="text-xl font-semibold">Ventes Analytics</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/analytics/revenue" element={<div className="p-6"><h2 className="text-xl font-semibold">Revenus Analytics</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="/analytics/activity" element={<div className="p-6"><h2 className="text-xl font-semibold">Activité Analytics</h2><p className="text-muted-foreground">Fonctionnalité en développement</p></div>} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}