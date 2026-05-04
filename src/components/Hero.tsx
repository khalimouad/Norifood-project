import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .eq('show_on_desktop', true)
          .order('position', { ascending: true });
        if (data) setBanners(data);
      } catch (e) {
        console.error('Error fetching banners:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: 'default',
            title: 'Ingrédients asiatiques de qualité pour les professionnels',
            subtitle:
              'Une sélection rigoureuse de produits sushi, asiatiques et surgelés, livrée à votre restaurant en 24h.',
            image_url: '',
            mobile_image_url: null,
            link_url: '/products',
            button_text: 'Découvrir le catalogue',
            is_active: true,
            show_on_desktop: true,
            show_on_mobile: true,
          } as Banner,
        ];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient red glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-10 md:py-16 lg:py-24">
                  {/* Text */}
                  <div className="space-y-6 text-center lg:text-left">
                    <span className="nori-chip">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Norifood · Frozen · Asian · Sushi
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                      {slide.title || 'Ingrédients asiatiques'}
                      <span className="block text-primary mt-1">pour les professionnels</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                      {slide.subtitle ||
                        "Une sélection rigoureuse de produits sushi, asiatiques et surgelés, livrée à votre restaurant en 24h."}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                      <Button
                        asChild
                        size="lg"
                        className="h-12 px-6 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide shadow-[0_8px_24px_-6px_hsl(var(--nori-red)/0.5)]"
                      >
                        <Link to={slide.link_url || '/products'}>
                          {slide.button_text || 'Découvrir le catalogue'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-12 px-6 rounded-md border-border bg-transparent text-foreground hover:bg-secondary uppercase tracking-wide"
                      >
                        <a href="tel:0608611511">
                          <Phone className="mr-2 h-4 w-4" />
                          Commander
                        </a>
                      </Button>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0">
                      {[
                        { v: '24h', l: 'Livraison' },
                        { v: '500+', l: 'Références' },
                        { v: '100%', l: 'Qualité Pro' },
                      ].map((s) => (
                        <div key={s.l} className="text-center lg:text-left">
                          <div className="text-2xl md:text-3xl font-extrabold text-primary">{s.v}</div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                            {s.l}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent rounded-3xl blur-2xl" />
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-nori-surface shadow-2xl">
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <DefaultHeroVisual />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === current ? 'w-8 bg-primary' : 'w-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const DefaultHeroVisual = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nori-surface via-black to-nori-surface relative">
    <div className="text-center space-y-3">
      <div className="text-7xl md:text-8xl font-black text-primary opacity-20 tracking-tighter">
        和
      </div>
      <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Premium Asian Ingredients
      </div>
    </div>
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-[0.04] pointer-events-none">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border border-foreground/30" />
      ))}
    </div>
  </div>
);
