import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, ShoppingCart, Tag, Receipt, Settings, BarChart3, Image, ChefHat, CreditCard, Percent } from 'lucide-react';
import { ProductsManager } from '@/components/admin/new/ProductsManager';
import { CategoriesManager } from '@/components/admin/new/CategoriesManager';
import { OrdersManager } from '@/components/admin/new/OrdersManager';
import { CustomersManager } from '@/components/admin/new/CustomersManager';
import { TagsManager } from '@/components/admin/new/TagsManager';
import { PaymentsManager } from '@/components/admin/new/PaymentsManager';
import { PromoCodesManager } from '@/components/admin/new/PromoCodesManager';
import { BannersManager } from '@/components/admin/new/BannersManager';
import { RecipesManager } from '@/components/admin/new/RecipesManager';
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
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
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Tags</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="promo-codes" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Promo</span>
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Bannières</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Recettes</span>
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

          <TabsContent value="tags" className="space-y-6">
            <TagsManager />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentsManager />
          </TabsContent>

          <TabsContent value="promo-codes" className="space-y-6">
            <PromoCodesManager />
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <BannersManager />
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <RecipesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}