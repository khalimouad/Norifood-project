import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { CategoryPills } from "@/components/CategoryPills";
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />

        {/* Glovo-style Category Pills */}
        <motion.div
          className="container mx-auto px-4 md:px-6 lg:px-8 -mt-4 mb-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CategoryPills />
        </motion.div>

        <motion.div className="fade-in">
          <FeaturedProducts />
        </motion.div>
        <Footer />
      </main>
      <BottomNavigation />
    </motion.div>
  );
};

export default Index;
