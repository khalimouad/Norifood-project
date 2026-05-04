import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ServiceBadges } from '@/components/ServiceBadges';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <ServiceBadges />
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Index;
