import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Tag,
  CreditCard,
  Percent,
  Image,
  ChefHat,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  Shield,
} from 'lucide-react';

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Produits", url: "/admin/products", icon: Package },
  { title: "Catégories", url: "/admin/categories", icon: Tag },
  { title: "Étiquettes", url: "/admin/tags", icon: Tag },
  { title: "Commandes", url: "/admin/orders", icon: ShoppingCart },
  { title: "Clients", url: "/admin/customers", icon: Users },
];

const managementItems = [
  { title: "Paiements", url: "/admin/payments", icon: CreditCard },
  { title: "Codes Promo", url: "/admin/promo-codes", icon: Percent },
  { title: "Bannières", url: "/admin/banners", icon: Image },
  { title: "Recettes", url: "/admin/recipes", icon: ChefHat },
  { title: "Config CMI", url: "/admin/cmi-config", icon: Shield },
];

const analyticsItems = [
  { title: "Ventes", url: "/admin/analytics/sales", icon: TrendingUp },
  { title: "Revenus", url: "/admin/analytics/revenue", icon: DollarSign },
  { title: "Activité", url: "/admin/analytics/activity", icon: Clock },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items: typeof mainItems) => items.some((item) => isActive(item.url));
  
  const getNavClass = (path: string) => 
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} hidden md:flex`}>
      <SidebarContent className="bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sm">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Gestion complète</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)} onClick={() => window.scrollTo(0, 0)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)} onClick={() => window.scrollTo(0, 0)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)} onClick={() => window.scrollTo(0, 0)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}