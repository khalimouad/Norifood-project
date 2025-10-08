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
    <section className="relative py-6 md:py-12 lg:py-16 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-slate-950 dark:to-primary/10">
      {/* Enhanced glowing blobs background with dark mode support */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/4 w-48 h-48 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-1/4 w-56 h-56 bg-primary/20 dark:bg-primary/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-40 h-40 bg-accent/15 dark:bg-accent/10 rounded-full blur-2xl opacity-70"></div>
        <div className="absolute top-8 right-8 w-52 h-52 bg-primary/12 dark:bg-primary/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Text Content - Shows second on mobile, left on desktop */}
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-3 md:space-y-5">
            <h1 className="hidden lg:block text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Produits de la Mer
              <span className="block text-primary text-2xl md:text-3xl lg:text-4xl mt-2">Frais Quotidiennement</span>
            </h1>
            <p className="hidden lg:block text-muted-foreground text-base md:text-lg max-w-lg">
              Poissons et fruits de mer de qualité premium, de l'océan à votre table avec fraîcheur garantie.
            </p>
            
            <div className="hidden lg:flex flex-wrap gap-3 md:gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Commander Maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium transition-all">
                Nos Promotions
              </Button>
            </div>

            {/* Features - Mobile friendly */}
            <div className="grid grid-cols-3 gap-3 md:flex md:gap-6 lg:gap-8 pt-2">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl shrink-0">
                  <Timer className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm">Livraison</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Rapide</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl shrink-0">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm">Fraîcheur</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Garantie</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                <div className="bg-primary/10 p-2 md:p-2.5 rounded-xl shrink-0">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm">Qualité</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Carousel - Shows first on mobile, right on desktop */}
          <div className="order-1 lg:order-2">
            {loading ? (
              <div className="bg-muted/30 rounded-2xl h-56 md:h-72 lg:h-80 animate-pulse"></div>
            ) : banners.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {banners.map((banner) => (
                      <CarouselItem key={banner.id}>
                         <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                            <div className="relative overflow-hidden">
                              <img 
                                src={banner.image_url} 
                                alt={banner.title} 
                                className="w-full h-44 md:h-56 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            </div>
                            <div className="p-4 md:p-5 bg-card/95 backdrop-blur-sm">
                              <h3 className="font-bold text-base md:text-lg lg:text-xl mb-1 md:mb-2 text-foreground line-clamp-1">{banner.title}</h3>
                              {banner.subtitle && (
                                <p className="text-muted-foreground text-xs md:text-sm mb-3 line-clamp-2">{banner.subtitle}</p>
                              )}
                              {banner.button_text && banner.link_url && (
                                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all text-xs md:text-sm">
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
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1.5 bg-background/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg border border-border/40">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          className={`rounded-full transition-all duration-300 ${
                            index === current 
                              ? 'bg-primary w-6 h-2 shadow-md shadow-primary/40' 
                              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2 h-2'
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
              <div className="bg-card/50 border border-border/40 rounded-2xl shadow-lg p-8 text-center">
                <p className="text-muted-foreground">Aucune bannière disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom subtle shadow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/10 via-background/5 to-transparent dark:from-slate-900/20 dark:via-slate-950/10 dark:to-transparent pointer-events-none"></div>
    </section>
  );
};