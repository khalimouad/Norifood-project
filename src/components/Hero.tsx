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

const FALLBACK: Banner = {
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
};

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

  const slides = banners.length > 0 ? banners : [FALLBACK];

  return (
    <section className="relative bg-background border-b border-border">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[520px] md:h-[560px] lg:h-[640px] overflow-hidden">
                {/* Background photo */}
                {slide.image_url ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <DefaultHeroBackdrop />
                )}

                {/* Black gradient overlay — from left on desktop, from bottom on mobile */}
                <div
                  className="absolute inset-0 md:hidden"
                  style={{
                    background:
                      'linear-gradient(to top, hsl(0 0% 0%) 0%, hsl(0 0% 0% / 0.85) 35%, hsl(0 0% 0% / 0.45) 75%, hsl(0 0% 0% / 0.25) 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 hidden md:block"
                  style={{
                    background:
                      'linear-gradient(to right, hsl(0 0% 0%) 0%, hsl(0 0% 0%) 35%, hsl(0 0% 0% / 0.6) 60%, transparent 80%)',
                  }}
                />

                {/* Copy block sits on the dark side */}
                <div className="container mx-auto px-4 md:px-6 lg:px-8 relative h-full">
                  <div className="absolute inset-0 flex items-end md:items-center px-4 md:px-6 lg:px-8 pb-10 md:pb-0">
                    <div className="max-w-xl space-y-5 md:space-y-6">
                      <span className="nori-chip">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Norifood · Frozen · Asian · Sushi
                      </span>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                        {slide.title || FALLBACK.title!.split(' pour ')[0]}
                      </h1>

                      {slide.subtitle && (
                        <p className="text-muted-foreground text-base md:text-lg max-w-lg">
                          {slide.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 pt-1">
                        <Button
                          asChild
                          size="lg"
                          className="h-12 px-6 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide"
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
                            Livraison rapide
                          </a>
                        </Button>
                      </div>

                      {/* Stat strip */}
                      <div className="grid grid-cols-3 gap-4 pt-4 max-w-md">
                        {[
                          { v: '24h', l: 'Livraison' },
                          { v: '500+', l: 'Références' },
                          { v: '100%', l: 'Qualité Pro' },
                        ].map((s) => (
                          <div key={s.l} className="text-left">
                            <div className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                              {s.v}
                            </div>
                            <div className="text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground mt-1">
                              {s.l}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots — anchored on the dark side */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 md:bottom-6 left-0 right-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex gap-2 pointer-events-auto">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === current ? 'w-8 bg-primary' : 'w-2 bg-foreground/40 hover:bg-foreground/60'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const DefaultHeroBackdrop = () => (
  <div className="absolute inset-0 flex items-center justify-end bg-card pr-12">
    <div className="text-right pr-4 md:pr-12 lg:pr-24 select-none">
      <div className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-black text-primary opacity-15 leading-none tracking-tighter">
        和
      </div>
    </div>
  </div>
);
