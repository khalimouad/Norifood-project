import { Truck, Award, Headphones, ShieldCheck } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Livraison rapide', desc: 'Sous 24-48h' },
  { icon: Award, title: 'Produits de qualité', desc: 'Sélection premium' },
  { icon: Headphones, title: 'Service pro dédié', desc: 'Support 7j/7' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', desc: 'Transactions chiffrées' },
];

export const ServiceBadges = () => {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex items-center gap-3 px-4 py-5 md:py-6"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <it.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground truncate">
                  {it.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
