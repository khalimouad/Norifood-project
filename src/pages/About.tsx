import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Fish, Award, Truck, Shield, Heart, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Award,
      title: "Qualité Premium",
      description: "Sélection rigoureuse des meilleurs produits de la mer",
      color: "text-yellow-500"
    },
    {
      icon: Truck,
      title: "Livraison Rapide",
      description: "Fraîcheur garantie avec livraison en 24h",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Confiance",
      description: "Plus de 20 ans d'expérience à Marrakech",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Amour des produits frais et du service client",
      color: "text-red-500"
    }
  ];

  const stats = [
    { value: "20+", label: "Années d'expérience" },
    { value: "5000+", label: "Clients satisfaits" },
    { value: "100+", label: "Produits frais" },
    { value: "24h", label: "Livraison rapide" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16 lg:py-24 pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary/10 mb-4 md:mb-6 animate-in zoom-in duration-500">
                <Fish className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6">
                Norifood
              </h1>
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
                Votre partenaire de confiance pour les produits de la mer à Marrakech depuis plus de 20 ans
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section - Overlapping */}
        <div className="container mx-auto px-4 -mt-12 md:-mt-16 mb-12 md:mb-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm border border-border animate-in fade-in slide-in-from-bottom-4 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="animate-in fade-in slide-in-from-left duration-700">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">Notre Histoire</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Depuis plus de deux décennies, Norifood s'est imposé comme la référence incontournable 
                    des produits de la mer à Marrakech. Notre passion pour la qualité et la fraîcheur guide 
                    chacune de nos actions.
                  </p>
                  <p>
                    Nous travaillons directement avec les meilleurs fournisseurs pour vous garantir des produits 
                    d'exception, livrés dans les meilleures conditions. Notre engagement : votre satisfaction 
                    et votre confiance.
                  </p>
                  <p>
                    Aujourd'hui, nous sommes fiers de servir des milliers de familles marocaines qui nous font 
                    confiance pour leurs repas quotidiens et leurs occasions spéciales.
                  </p>
                </div>
              </div>
              
              <div className="relative animate-in fade-in slide-in-from-right duration-700">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Users className="h-32 w-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Nos Valeurs</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Ce qui nous guide au quotidien pour vous offrir le meilleur service
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl ${value.color} bg-current/10 mb-3 md:mb-4`}>
                    <value.icon className={`h-6 w-6 md:h-7 md:w-7 ${value.color}`} />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary to-primary/80 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-white animate-in fade-in zoom-in duration-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Prêt à commander ?</h2>
            <p className="text-white/90 mb-6 md:mb-8 text-base md:text-lg">
              Découvrez notre sélection de produits frais et passez votre commande en quelques clics
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center h-11 md:h-12 px-6 md:px-8 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-all duration-200 active:scale-95 text-sm md:text-base"
            >
              Voir nos produits
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
