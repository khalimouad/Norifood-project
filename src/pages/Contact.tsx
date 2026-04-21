import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais."
    });
    
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      details: ["0608 611 511", "0608 411 511"],
      action: "tel:0608611511",
      color: "text-green-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@freshngood.ma"],
      action: "mailto:contact@freshngood.ma",
      color: "text-blue-500"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Imm. Assala - 50 Gueliz", "Bd Mohamed VI, Marrakech"],
      action: "https://maps.google.com",
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 mb-4 md:mb-6">
                <MessageCircle className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
                Contactez-nous
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Une question ? Besoin d'aide ? Notre équipe est là pour vous répondre
              </p>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="container mx-auto px-4 -mt-6 md:-mt-8 mb-8 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.action}
                target={item.action.startsWith('http') ? '_blank' : undefined}
                rel={item.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-card rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl ${item.color} bg-current/10 mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-5 w-5 md:h-6 md:w-6 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-sm md:text-base">{item.title}</h3>
                {item.details.map((detail, i) => (
                  <p key={i} className="text-xs md:text-sm text-muted-foreground">{detail}</p>
                ))}
              </a>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-sm border border-border animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-5 md:mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    required
                    className="h-12"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Téléphone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06XX XX XX XX"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez votre demande..."
                    required
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
