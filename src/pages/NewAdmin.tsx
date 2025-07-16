import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, Tag, Receipt, Settings, BarChart3 } from 'lucide-react';
import { ProductsManager } from '@/components/admin/new/ProductsManager';
import { CategoriesManager } from '@/components/admin/new/CategoriesManager';
import { OrdersManager } from '@/components/admin/new/OrdersManager';
import { CustomersManager } from '@/components/admin/new/CustomersManager';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate } from 'react-router-dom';

export default function NewAdmin() {
  const { isAdmin, loading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('products');

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administration</h1>
          <p className="text-muted-foreground">Gérez votre boutique en ligne</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Catégories</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomersManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques
                </CardTitle>
                <CardDescription>
                  Analysez les performances de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Module d'analytics à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres
                </CardTitle>
                <CardDescription>
                  Configurez votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Paramètres à venir...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}