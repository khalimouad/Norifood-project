import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Grid3X3, 
  Tags, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Ticket, 
  BookOpen, 
  ImageIcon 
} from "lucide-react";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";
import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";
import { TagsAdmin } from "@/components/admin/TagsAdmin";
import { CustomersAdmin } from "@/components/admin/CustomersAdmin";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { PaymentsAdmin } from "@/components/admin/PaymentsAdmin";
import { PromoCodesAdmin } from "@/components/admin/PromoCodesAdmin";
import { RecipesAdmin } from "@/components/admin/RecipesAdmin";
import { BannersAdmin } from "@/components/admin/BannersAdmin";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  // For now, we'll check if user exists - in production you'd check admin role
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const adminSections = [
    { id: "products", label: "Produits", icon: Package, component: ProductsAdmin },
    { id: "categories", label: "Catégories", icon: Grid3X3, component: CategoriesAdmin },
    { id: "tags", label: "Étiquettes", icon: Tags, component: TagsAdmin },
    { id: "customers", label: "Clients", icon: Users, component: CustomersAdmin },
    { id: "orders", label: "Commandes", icon: ShoppingCart, component: OrdersAdmin },
    { id: "payments", label: "Paiements", icon: CreditCard, component: PaymentsAdmin },
    { id: "promos", label: "Codes Promo", icon: Ticket, component: PromoCodesAdmin },
    { id: "recipes", label: "Recettes", icon: BookOpen, component: RecipesAdmin },
    { id: "banners", label: "Bannières", icon: ImageIcon, component: BannersAdmin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Panel d'Administration</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-6">
            {adminSections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="flex items-center gap-2 text-xs lg:text-sm"
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {adminSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    Gestion des {section.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <section.component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;