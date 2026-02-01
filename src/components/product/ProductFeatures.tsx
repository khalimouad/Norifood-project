import { Card, CardContent } from "@/components/ui/card";
import { Truck, Shield, Clock } from "lucide-react";

export const ProductFeatures = () => {
  return (
    <Card className="border-0 bg-muted/50">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Livraison Express</p>
              <p className="text-xs text-muted-foreground">Même jour ou 24h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Fraîcheur Garantie</p>
              <p className="text-xs text-muted-foreground">Chaîne du froid</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Préparation Express</p>
              <p className="text-xs text-muted-foreground">Prêt en 2h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
