import { Truck, Award, Headphones, ShieldCheck } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Livraison rapide', desc: 'Sous 24-48h' },
  { icon: Award, title: 'Produits de qualité', desc: 'Sélection premium' },
  { icon: Headphones, title: 'Service pro dédié', desc: 'Support 7j/7' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', desc: 'Transactions chiffrées' },
];

const NorifoodTruck = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 220 80"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cab */}
    <rect x="6" y="22" width="46" height="38" rx="4" fill="hsl(358 79% 51%)" />
    <rect x="14" y="30" width="30" height="14" rx="2" fill="#0a0a0a" />
    <rect x="14" y="30" width="30" height="14" rx="2" stroke="#fff" strokeOpacity="0.18" strokeWidth="1" />
    {/* Trailer */}
    <rect x="52" y="10" width="160" height="50" rx="4" fill="hsl(358 79% 51%)" />
    {/* Wordmark on trailer */}
    <text
      x="132"
      y="38"
      textAnchor="middle"
      fontFamily="Montserrat, sans-serif"
      fontWeight="900"
      fontSize="22"
      fill="#ffffff"
      letterSpacing="1"
    >
      NORI
      <tspan fill="#0a0a0a">FOOD</tspan>
    </text>
    <text
      x="132"
      y="52"
      textAnchor="middle"
      fontFamily="Montserrat, sans-serif"
      fontWeight="700"
      fontSize="6"
      fill="#fff"
      letterSpacing="3"
    >
      FROZEN · ASIAN · SUSHI
    </text>
    {/* Wheels */}
    <circle cx="28" cy="64" r="9" fill="#0a0a0a" />
    <circle cx="28" cy="64" r="3.5" fill="#3a3a3a" />
    <circle cx="80" cy="64" r="9" fill="#0a0a0a" />
    <circle cx="80" cy="64" r="3.5" fill="#3a3a3a" />
    <circle cx="180" cy="64" r="9" fill="#0a0a0a" />
    <circle cx="180" cy="64" r="3.5" fill="#3a3a3a" />
  </svg>
);

export const ServiceBadges = () => {
  return (
    <section className="border-y border-border bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-border">
          {items.map((it) => (
            <div key={it.title} className="flex items-center gap-3 px-4 py-5 md:py-6">
              <it.icon className="h-6 w-6 text-primary shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-foreground truncate">
                  {it.title}
                </p>
                <p className="text-[11px] md:text-xs text-muted-foreground truncate">{it.desc}</p>
              </div>
            </div>
          ))}
          <div className="hidden lg:flex items-center justify-center px-4 py-2">
            <NorifoodTruck className="h-14 w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
