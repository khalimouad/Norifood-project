import { Button } from '@/components/ui/button';
import { ArrowRight, Timer, Star, Award } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string | null;
  button_text: string | null;
  is_active: boolean;
  show_on_desktop: boolean;
  show_on_mobile: boolean;
}

export const Hero = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('show_on_desktop', true)
        .order('position', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-8 md:py-16 overflow-hidden">
      {/* Awesome glowing blue blobs background - contained within hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/4 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-1/4 w-56 h-56 bg-primary/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-40 h-40 bg-blue-400/25 rounded-full blur-2xl opacity-70"></div>
        <div className="absolute top-8 right-8 w-52 h-52 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-8 left-1/3 w-36 h-36 bg-primary/35 rounded-full blur-2xl opacity-80"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-300/30 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content - Shows second on mobile, left on desktop */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-4 md:space-y-6">
            <h1 className="hidden lg:block text-2xl md:text-5xl font-bold text-foreground leading-tight">
              Produits de la Mer
              <span className="block text-primary text-xl md:text-4xl mt-1 md:mt-2">Frais Quotidiennement</span>
            </h1>
            <p className="hidden lg:block text-muted-foreground text-base md:text-lg max-w-lg mx-auto lg:mx-0 px-4 md:px-0">
              Poissons et fruits de mer de qualité premium, de l'océan à votre table avec fraîcheur garantie.
            </p>
            
            <div className="hidden lg:flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 md:px-0">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-sm md:text-base">
                Commander Maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-sm md:text-base">
                Nos Promotions
              </Button>
            </div>

            {/* Features - Condensed for mobile */}
            <div className="flex justify-center lg:justify-start gap-4 md:gap-8 px-2 md:px-0">
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Timer className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">Livraison Rapide</p>
                  <p className="text-xs text-muted-foreground">Même jour</p>
                </div>
                <p className="font-semibold text-xs md:hidden">Rapide</p>
              </div>
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">Fraîcheur</p>
                  <p className="text-xs text-muted-foreground">Garantie</p>
                </div>
                <p className="font-semibold text-xs md:hidden">Frais</p>
              </div>
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                  <Award className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-sm">Qualité</p>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
                <p className="font-semibold text-xs md:hidden">Premium</p>
              </div>
            </div>
          </div>

          {/* Banner Carousel - Shows first on mobile, right on desktop */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl">
              {loading ? (
                <div className="bg-card rounded-xl shadow-lg h-64 animate-pulse"></div>
              ) : banners.length > 0 ? (
                <div className="space-y-4">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                           <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                             <img 
                               src={banner.image_url} 
                               alt={banner.title} 
                               className="w-full h-48 md:h-64 object-cover" 
                             />
                             <div className="p-4">
                               <h3 className="font-semibold text-lg mb-2">{banner.title}</h3>
                               {banner.subtitle && (
                                 <p className="text-muted-foreground text-sm mb-3">{banner.subtitle}</p>
                               )}
                               {banner.button_text && banner.link_url && (
                                 <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                                   <a href={banner.link_url}>{banner.button_text}</a>
                                 </Button>
                               )}
                             </div>
                           </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Modern Dot Navigation */}
                  {banners.length > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg shadow-blue-400/30">
                        {banners.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === current 
                                ? 'bg-primary w-6 shadow-lg shadow-primary/50' 
                                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-card rounded-xl shadow-lg p-8 text-center">
                  <p className="text-muted-foreground">Aucune bannière disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom subtle shadow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100/20 via-gray-50/10 to-transparent pointer-events-none"></div>
    </section>
  );
};