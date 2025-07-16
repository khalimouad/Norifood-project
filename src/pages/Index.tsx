import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <FeaturedProducts />
        <Footer />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Index;
