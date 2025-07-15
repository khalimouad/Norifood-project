import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20"> {/* Add bottom padding for bottom navigation */}
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Footer />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Index;
