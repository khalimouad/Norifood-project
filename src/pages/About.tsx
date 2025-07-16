import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fish, 
  Waves, 
  Award, 
  Users, 
  Clock, 
  Truck, 
  Shield, 
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Années d'expérience", value: "25+", icon: Award },
    { label: "Clients satisfaits", value: "10K+", icon: Users },
    { label: "Livraisons par jour", value: "200+", icon: Truck },
    { label: "Variétés de poissons", value: "50+", icon: Fish }
  ];

  const values = [
    {
      icon: Fish,
      title: "Fraîcheur Garantie",
      description: "Nos produits sont pêchés et livrés dans les 24h pour une fraîcheur optimale."
    },
    {
      icon: Shield,
      title: "Qualité Premium",
      description: "Sélection rigoureuse de nos fournisseurs et contrôle qualité à chaque étape."
    },
    {
      icon: Clock,
      title: "Livraison Rapide",
      description: "Livraison le jour même possible avec notre service express."
    },
    {
      icon: Waves,
      title: "Pêche Durable",
      description: "Nous soutenons la pêche responsable pour préserver nos océans."
    }
  ];

  const team = [
    {
      name: "Mohamed Alami",
      role: "Fondateur & Directeur",
      experience: "25 ans d'expérience dans la pêche",
      image: "/placeholder.svg"
    },
    {
      name: "Fatima Benali",
      role: "Chef des Achats",
      experience: "Expert en sélection de produits marins",
      image: "/placeholder.svg"
    },
    {
      name: "Omar Tazi",
      role: "Responsable Qualité",
      experience: "Spécialiste en sécurité alimentaire",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ocean to-ocean-light text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              À Propos de Fresh N'Good
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Depuis 1999, nous nous engageons à vous offrir les meilleurs produits de la mer 
              avec une fraîcheur et une qualité inégalées.
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="h-4 w-4 mr-1" />
              Note moyenne: 4.9/5
            </Badge>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean/10 rounded-full mb-4">
                    <stat.icon className="h-8 w-8 text-ocean" />
                  </div>
                  <div className="text-3xl font-bold text-ocean mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                Notre Histoire
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-ocean">
                    Une Passion Familiale
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Fresh N'Good a été fondée en 1999 par Mohamed Alami, un passionné de la mer 
                    qui a grandi dans une famille de pêcheurs à Casablanca. Avec plus de 25 ans 
                    d'expérience, nous avons développé un réseau de confiance avec les meilleurs 
                    pêcheurs locaux.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Notre mission est simple : vous offrir des produits de la mer d'une fraîcheur 
                    exceptionnelle, directement de l'océan à votre table. Nous croyons que la 
                    qualité ne doit jamais être compromise.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Aujourd'hui, Fresh N'Good est devenu une référence au Maroc pour les produits 
                    de la mer premium, servant plus de 10 000 clients satisfaits à travers le pays.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src="/placeholder.svg" 
                    alt="Notre équipe" 
                    className="rounded-lg shadow-lg w-full h-96 object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg">
                    <div className="text-2xl font-bold text-ocean">1999</div>
                    <div className="text-sm text-gray-600">Année de création</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Nos Valeurs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean/10 rounded-full mb-4">
                      <value.icon className="h-8 w-8 text-ocean" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Notre Équipe
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-ocean font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="py-16 bg-gradient-to-r from-ocean to-ocean-light text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Découvrir Nos Produits ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour commander vos produits de la mer frais 
              ou visitez notre boutique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-ocean hover:bg-gray-100">
                <Phone className="h-5 w-5 mr-2" />
                Nous Appeler
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ocean">
                <Mail className="h-5 w-5 mr-2" />
                Nous Écrire
              </Button>
            </div>
            
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <MapPin className="h-6 w-6 mb-2" />
                <p className="font-medium">Adresse</p>
                <p className="text-white/80 text-sm">123 Avenue Hassan II, Casablanca</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-6 w-6 mb-2" />
                <p className="font-medium">Téléphone</p>
                <p className="text-white/80 text-sm">+212 522 123 456</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-6 w-6 mb-2" />
                <p className="font-medium">Horaires</p>
                <p className="text-white/80 text-sm">Lun-Sam: 8h-20h</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default About;