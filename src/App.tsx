import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from 'framer-motion';
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TermsOfSale from "./pages/TermsOfSale";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Recipes from "./pages/Recipes";
import Admin from "./pages/Admin";
import AdminEnhanced from "./pages/AdminEnhanced";
import AdminProductForm from "./pages/AdminProductForm";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import { CartProvider } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

// Page transition wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CartProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
                  <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
                  <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                  <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                  <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                  <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
                  <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                  <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                  <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                  <Route path="/order-confirmation" element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
                  <Route path="/recipes" element={<PageWrapper><Recipes /></PageWrapper>} />
                  <Route path="/conditions-de-vente" element={<PageWrapper><TermsOfSale /></PageWrapper>} />
                  <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
                  <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
                  <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
                  <Route path="/shipping" element={<PageWrapper><Shipping /></PageWrapper>} />
                  <Route path="/admin/*" element={<PageWrapper><AdminEnhanced /></PageWrapper>} />
                  <Route path="/admin-old/*" element={<PageWrapper><Admin /></PageWrapper>} />
                  <Route path="/admin/product/new" element={<PageWrapper><AdminProductForm /></PageWrapper>} />
                  <Route path="/admin/product/:id" element={<PageWrapper><AdminProductForm /></PageWrapper>} />
                  <Route path="/payment-success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
                  <Route path="/payment-cancel" element={<PageWrapper><PaymentCancel /></PageWrapper>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
