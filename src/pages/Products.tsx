import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, ChevronDown, X, SlidersHorizontal, Waves } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

type Product = Tables<"products">;
type Category = Tables<"categories">;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || "all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterAndSortProducts();
      generateSearchSuggestions();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true),
        supabase.from("categories").select("*").eq("is_active", true)
      ]);
      if (productsResponse.data) setProducts(productsResponse.data);
      if (categoriesResponse.data) setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const calculateRelevanceScore = (product: Product, searchWords: string[]) => {
    const name = normalizeText(product.name || '');
    const description = normalizeText(product.description || '');
    const productType = normalizeText(product.product_type || '');
    const origin = normalizeText(product.origin || '');
    let score = 0;
    searchWords.forEach(word => {
      if (word.length < 2) return;
      if (name === word) score += 100;
      else if (name.startsWith(word)) score += 80;
      else if (name.split(' ').includes(word)) score += 60;
      else if (word.length >= 3 && name.includes(word)) score += 30;
      if (productType === word) score += 50;
      else if (productType.split(' ').includes(word)) score += 25;
      if (description.split(' ').includes(word)) score += 20;
      if (origin.split(' ').includes(word)) score += 15;
    });
    return score;
  };

  const filterAndSortProducts = () => {
    let filtered = products;
    if (searchTerm) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 1);
      if (searchWords.length > 0) {
        const productsWithScores = products.map(product => ({
          product, score: calculateRelevanceScore(product, searchWords)
        })).filter(item => item.score > 0);
        productsWithScores.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.product.name.localeCompare(b.product.name);
        });
        filtered = productsWithScores.map(item => item.product);
      }
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.base_price - b.base_price;
        case "price-high": return b.base_price - a.base_price;
        case "name": default: return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  };

  const generateSearchSuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) { setSearchSuggestions([]); return; }
    const suggestions = new Set<string>();
    const normalizedSearchTerm = normalizeText(searchTerm);
    products.forEach(product => {
      [product.name, product.description || '', product.product_type || '', product.origin || ''].forEach(term => {
        if (term) {
          normalizeText(term).split(' ').forEach(word => {
            if (word.startsWith(normalizedSearchTerm) && word.length > normalizedSearchTerm.length) suggestions.add(word);
          });
          if (normalizeText(term).includes(normalizedSearchTerm)) suggestions.add(term);
        }
      });
    });
    setSearchSuggestions(Array.from(suggestions).slice(0, 5));
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
    setShowSuggestions(false);
  };

  const activeFilterCount = (searchTerm ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0) + (sortBy !== "name" ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="relative overflow-hidden glovo-gradient-bg text-white py-12 md:py-16">
            <div className="container mx-auto px-4 text-center relative z-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 slide-up">Nos Produits Frais</h1>
              <p className="text-lg md:text-xl opacity-90 fade-in">
                Découvrez notre sélection de poissons et fruits de mer de qualité premium
              </p>
            </div>
            {/* Wave decoration */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" className="fill-background"/>
              </svg>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <ProductGridSkeleton count={8} />
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Hero Section with Wave */}
        <div className="relative overflow-hidden glovo-gradient-bg text-white py-12 md:py-16">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 slide-up drop-shadow-lg">
              Nos Produits Frais
            </h1>
            <p className="text-lg md:text-xl opacity-90 fade-in max-w-2xl mx-auto" style={{ animationDelay: '100ms' }}>
              Découvrez notre sélection de poissons et fruits de mer de qualité premium
            </p>
          </div>
          {/* Floating decorations */}
          <div className="absolute top-4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl float-animation"></div>
          <div className="absolute bottom-8 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl float-animation" style={{ animationDelay: '1.5s' }}></div>
          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" className="fill-background"/>
            </svg>
          </div>
        </div>

        {/* Category pills - horizontal scroll */}
        <div className="container mx-auto px-4 -mt-2 mb-4 relative z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-1 stagger-children">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`category-pill flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 button-press focus-ring ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-glovo-purple to-glovo-orange text-white shadow-lg shadow-glovo-purple/20"
                  : "glass-card text-foreground hover:bg-glovo-purple/10"
              }`}
            >
              🐟 Tout
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-pill flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 button-press focus-ring ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-glovo-purple to-glovo-orange text-white shadow-lg shadow-glovo-purple/20"
                    : "glass-card text-foreground hover:bg-glovo-purple/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="container mx-auto px-4 py-4">
          {isMobile ? (
            /* Mobile Filter Bar */
            <div className="glass-card p-3 mb-6 fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 rounded-xl btn-bounce focus-ring relative">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtres
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-glovo-orange text-white text-xs rounded-full h-4 w-4 flex items-center justify-center glovo-glow">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="glass-card">
                    <DrawerHeader>
                      <DrawerTitle className="gradient-text text-lg">Filtres</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Catégorie</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-full rounded-xl focus-ring"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                          <SelectContent className="glass-card">
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Trier par</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-full rounded-xl focus-ring"><SelectValue placeholder="Trier par" /></SelectTrigger>
                          <SelectContent className="glass-card">
                            <SelectItem value="name">Nom A-Z</SelectItem>
                            <SelectItem value="price-low">Prix croissant</SelectItem>
                            <SelectItem value="price-high">Prix décroissant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setFilterDrawerOpen(false)} className="flex-1 bg-gradient-to-r from-glovo-purple to-glovo-orange text-white rounded-xl button-press">Appliquer</Button>
                        {activeFilterCount > 0 && <Button variant="outline" onClick={clearFilters} className="flex-1 rounded-xl button-press">Effacer</Button>}
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>

                <div className="flex bg-muted/80 rounded-xl p-1 ml-auto border border-border/50">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={`h-8 w-8 p-0 rounded-lg button-press ${viewMode === "grid" ? "bg-glovo-purple text-white" : ""}`}>
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={`h-8 w-8 p-0 rounded-lg button-press ${viewMode === "list" ? "bg-glovo-purple text-white" : ""}`}>
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 rounded-xl focus-ring bg-background/60 transition-all duration-300 focus:bg-background"
                  autoComplete="off"
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(""); setShowSuggestions(false); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors btn-bounce">
                    <X className="h-4 w-4" />
                  </button>
                )}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 glass-card mt-2 z-50 max-h-48 overflow-y-auto custom-scrollbar">
                    {searchSuggestions.map((suggestion, index) => (
                      <button key={index} onClick={() => handleSearchSuggestionClick(suggestion)} className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-all duration-200 flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl focus-ring">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(searchTerm || selectedCategory !== "all") && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">Filtres:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1 rounded-full">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1 rounded-full">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Desktop Filters */
            <div className="glass-card p-6 mb-8 fade-in">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={e => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-10 rounded-xl focus-ring bg-background/60 transition-all duration-300 focus:bg-background"
                      autoComplete="off"
                    />
                    {searchTerm && (
                      <button onClick={() => { setSearchTerm(""); setShowSuggestions(false); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors btn-bounce">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 glass-card mt-2 z-50 max-h-48 overflow-y-auto custom-scrollbar">
                        {searchSuggestions.map((suggestion, index) => (
                          <button key={index} onClick={() => handleSearchSuggestionClick(suggestion)} className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-all duration-200 flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl focus-ring"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl focus-ring"><SelectValue placeholder="Trier par" /></SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="name">Nom A-Z</SelectItem>
                      <SelectItem value="price-low">Prix croissant</SelectItem>
                      <SelectItem value="price-high">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-muted/80 rounded-xl p-1 border border-border/50">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className={`h-8 w-8 p-0 rounded-lg button-press ${viewMode === "grid" ? "bg-glovo-purple text-white" : ""}`}>
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className={`h-8 w-8 p-0 rounded-lg button-press ${viewMode === "list" ? "bg-glovo-purple text-white" : ""}`}>
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  {activeFilterCount > 0 && (
                    <Button variant="outline" onClick={clearFilters} className="rounded-xl button-press focus-ring">
                      <X className="h-4 w-4 mr-1" />
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              </div>

              {(searchTerm || selectedCategory !== "all") && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                  <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1 rounded-full hover-lift">
                      Recherche: "{searchTerm}"
                      <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1 rounded-full hover-lift">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6 fade-in">
            <p className="text-muted-foreground text-sm md:text-base">
              <span className="font-semibold text-foreground">{filteredProducts.length}</span> produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" : "space-y-4"} stagger-children`}>
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="fade-in" style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={product.description || ""}
                    price={product.base_price}
                    image={product.image_url || "/placeholder.svg"}
                    unitType={product.unit_type as 'kg' | 'units' | 'g' | 'pieces'}
                    inStock={product.stock_quantity ? product.stock_quantity > 0 : true}
                    featured={product.featured || false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 fade-in">
              <div className="glass-card inline-block p-8 mb-4">
                <Filter className="h-16 w-16 mx-auto text-muted-foreground mb-4 float-animation" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearFilters} variant="outline" className="rounded-xl button-press focus-ring">
                  <X className="h-4 w-4 mr-2" />
                  Effacer tous les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Products;
