import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Menu,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Tag,
  CreditCard,
  Percent,
  Image,
  ChefHat,
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
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

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Gestion complète</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Principal
                </h3>
                <div className="space-y-1">
                  {mainItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Gestion
                </h3>
                <div className="space-y-1">
                  {managementItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Analytics
                </h3>
                <div className="space-y-1">
                  {analyticsItems.map((item) => (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
