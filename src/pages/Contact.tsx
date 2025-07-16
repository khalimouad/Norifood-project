import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  Headphones,
  Truck
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });

    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Téléphone",
      subtitle: "Appelez-nous directement",
      value: "0608 611 511",
      action: "Appeler",
      available: "7j/7, 8h-20h"
    },
    {
      icon: Mail,
      title: "Email",
      subtitle: "Écrivez-nous",
      value: "contact@freshngood.ma",
      action: "Écrire",
      available: "Réponse sous 2h"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      subtitle: "Chat en direct",
      value: "0608 411 511",
      action: "Chatter",
      available: "En ligne maintenant"
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      details: [
        "Imm Assala",
        "Marrakech",
        "Maroc"
      ]
    },
    {
      icon: Clock,
      title: "Horaires d'ouverture",
      details: [
        "Lundi - Vendredi: 8h00 - 20h00",
        "Samedi: 8h00 - 18h00",
        "Dimanche: 10h00 - 16h00"
      ]
    },
    {
      icon: Truck,
      title: "Zones de livraison",
      details: [
        "Marrakech ville",
        "Zones avoisinantes",
        "Livraison rapide 24h"
      ]
    }
  ];

  const faqItems = [
    {
      question: "Comment garantissez-vous la fraîcheur ?",
      answer: "Nos produits sont livrés dans les 24h suivant la pêche avec une chaîne du froid respectée."
    },
    {
      question: "Proposez-vous la livraison le jour même ?",
      answer: "Oui, pour les commandes passées avant 14h à Marrakech."
    },
    {
      question: "Puis-je annuler ma commande ?",
      answer: "Les commandes peuvent être annulées jusqu'à 2h avant la livraison prévue."
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
              Contactez-Nous
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner 
              dans votre expérience Fresh N'Good.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Headphones className="h-4 w-4 mr-1" />
                Support 7j/7
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Clock className="h-4 w-4 mr-1" />
                Réponse rapide
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Plusieurs Moyens de Nous Joindre
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean/10 rounded-full mb-4">
                      <method.icon className="h-8 w-8 text-ocean" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{method.subtitle}</p>
                    <p className="font-medium text-ocean mb-3">{method.value}</p>
                    <Badge variant="outline" className="mb-4 text-green-600 border-green-600">
                      {method.available}
                    </Badge>
                    <div>
                      <Button className="w-full">
                        {method.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  Envoyez-nous un Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Envoyer le Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Informations de Contact
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-ocean/10 rounded-full">
                                <info.icon className="h-6 w-6 text-ocean" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {info.title}
                              </h3>
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="text-gray-600">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    Questions Fréquentes
                  </h3>
                  <div className="space-y-4">
                    {faqItems.map((faq, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base text-ocean">
                            {faq.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 text-sm">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Notre Emplacement
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Carte Interactive</p>
                  <p className="text-sm">Imm Assala, Marrakech</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ouvrir dans Google Maps
                </Button>
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

export default Contact;