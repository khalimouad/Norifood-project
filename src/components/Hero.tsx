import { Button } from '@/components/ui/button';
import { ArrowRight, Truck, Waves, ShieldCheck } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

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
    <section className="relative py-6 md:py-12 lg:py-16 overflow-hidden">
      {/* Clean background — single-hue blue tint */}
      <div className="absolute inset-0 pointer-events-none bg-glovo-purple/[0.03] dark:bg-glovo-purple/10">
        {/* Soft vibrant-blue glows (single-color blurred shapes, not gradients) */}
        <motion.div
          className="absolute -top-10 -left-20 w-80 h-80 bg-glovo-purple/15 dark:bg-glovo-purple/25 rounded-full blur-3xl"
          animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-10 w-96 h-96 bg-glovo-orange/20 dark:bg-glovo-orange/25 rounded-full blur-3xl"
          animate={{ y: [0, -18, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* Rising bubbles */}
        <div className="bubble w-4 h-4 bottom-8 left-[12%]" style={{ animationDelay: '0s' }} />
        <div className="bubble w-3 h-3 bottom-16 left-[28%]" style={{ animationDelay: '1.5s', animationDuration: '10s' }} />
        <div className="bubble w-6 h-6 bottom-4 left-[65%]" style={{ animationDelay: '0.8s', animationDuration: '7s' }} />
        <div className="bubble w-2.5 h-2.5 bottom-20 left-[80%]" style={{ animationDelay: '2.2s', animationDuration: '9s' }} />
        <div className="bubble w-5 h-5 bottom-10 left-[45%]" style={{ animationDelay: '3s', animationDuration: '8s' }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Text Content - Shows second on mobile, left on desktop */}
          <motion.div
            className="order-2 lg:order-1 text-center lg:text-left space-y-3 md:space-y-5 stagger-children"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hidden lg:block">
              <motion.span
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Produits de la Mer
              </motion.span>
              <motion.span
                className="block mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-glovo-purple"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Frais Quotidiennement
              </motion.span>
            </h1>

            {/* Mobile hero text */}
            <div className="lg:hidden text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
                Produits de la Mer
              </h1>
              <p className="text-xl md:text-2xl font-bold text-glovo-purple">
                Frais Quotidiennement
              </p>
            </div>

            <motion.p
              className="hidden lg:block text-muted-foreground text-base md:text-lg max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Poissons et fruits de mer de qualité premium, de l'océan à votre table avec fraîcheur garantie.
            </motion.p>

            {/* Mobile description */}
            <motion.p
              className="lg:hidden text-muted-foreground text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Qualité premium, fraîcheur garantie
            </motion.p>

            <motion.div
              className="hidden lg:flex flex-wrap gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="bg-glovo-purple hover:bg-glovo-purple/90 text-white px-7 md:px-9 py-2.5 md:py-3 rounded-full font-semibold shadow-lg shadow-glovo-purple/25 hover:shadow-xl hover:shadow-glovo-purple/35 transition-all duration-300 hover-lift focus-ring"
                onClick={() => window.location.href = '/products'}
              >
                Commander Maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-glovo-purple/60 text-glovo-purple bg-white dark:bg-card hover:bg-glovo-purple hover:text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition-all duration-300 hover-lift focus-ring"
              >
                Nos Promotions
              </Button>
            </motion.div>

            {/* Mobile buttons */}
            <motion.div
              className="lg:hidden flex gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                className="flex-1 bg-glovo-purple text-white py-3 rounded-full font-semibold shadow-lg shadow-glovo-purple/25 hover-lift focus-ring text-sm"
                onClick={() => window.location.href = '/products'}
              >
                Commander
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Features - Mobile friendly */}
            <motion.div
              className="grid grid-cols-3 gap-3 md:flex md:gap-6 lg:gap-8 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="bg-glovo-purple/10 p-2.5 md:p-3 rounded-2xl shrink-0 ring-1 ring-glovo-purple/15">
                  <Truck className="h-4 w-4 md:h-5 md:w-5 text-glovo-purple" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm text-foreground">Livraison</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">1-2h à Marrakech</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="bg-glovo-green/10 p-2.5 md:p-3 rounded-2xl shrink-0 ring-1 ring-glovo-green/20">
                  <Waves className="h-4 w-4 md:h-5 md:w-5 text-glovo-green" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm text-foreground">Fraîcheur</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">De l'océan</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="bg-glovo-orange/10 p-2.5 md:p-3 rounded-2xl shrink-0 ring-1 ring-glovo-orange/20">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-glovo-orange" />
                </div>
                <div className="text-center md:text-left">
                  <p className="font-semibold text-xs md:text-sm text-foreground">Qualité</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Premium</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Banner Carousel - Shows first on mobile, right on desktop */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {loading ? (
              <div className="glass-card h-56 md:h-72 lg:h-80 animate-pulse rounded-2xl"></div>
            ) : banners.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
                  <CarouselContent>
                    {banners.map((banner) => (
                      <CarouselItem key={banner.id}>
                        <div className="glovo-card overflow-hidden rounded-2xl">
                          <div className="relative overflow-hidden">
                            <img
                              src={banner.image_url}
                              alt={banner.title}
                              className="w-full h-44 md:h-56 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                            <h3 className="font-bold text-base md:text-lg lg:text-xl mb-1 md:mb-2 text-white line-clamp-1 drop-shadow-lg">
                              {banner.title}
                            </h3>
                            {banner.subtitle && (
                              <p className="text-white/90 text-xs md:text-sm mb-3 line-clamp-2 drop-shadow">
                                {banner.subtitle}
                              </p>
                            )}
                            {banner.button_text && banner.link_url && (
                              <Button
                                asChild
                                size="sm"
                                className="bg-white text-gray-900 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all text-xs md:text-sm button-press focus-ring"
                              >
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
                    <div className="glass inline-flex items-center gap-1.5 px-4 py-2 rounded-full">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          className={`rounded-full transition-all duration-300 hover:scale-125 ${
                            index === current
                              ? 'bg-glovo-purple w-6 h-2 shadow-md shadow-glovo-purple/40 glovo-glow'
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
              <div className="glass-card p-8 text-center rounded-2xl">
                <p className="text-muted-foreground">Aucune bannière disponible</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Subtle wave divider */}
      <div className="wave-divider bottom-0"></div>
    </section>
  );
};
