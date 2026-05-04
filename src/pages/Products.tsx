import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductListItem } from "@/components/ProductListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductGridSkeleton } from "@/components/skeletons/ProductCardSkeleton";

type Product = Tables<"products">;
type Category = Tables<"categories">;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all",
  );
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
        supabase.from("categories").select("*").eq("is_active", true),
      ]);
      if (productsResponse.data) setProducts(productsResponse.data);
      if (categoriesResponse.data) setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const calculateRelevanceScore = (product: Product, searchWords: string[]) => {
    const name = normalizeText(product.name || "");
    const description = normalizeText(product.description || "");
    const productType = normalizeText(product.product_type || "");
    const origin = normalizeText(product.origin || "");
    let score = 0;
    searchWords.forEach((word) => {
      if (word.length < 2) return;
      if (name === word) score += 100;
      else if (name.startsWith(word)) score += 80;
      else if (name.split(" ").includes(word)) score += 60;
      else if (word.length >= 3 && name.includes(word)) score += 30;
      if (productType === word) score += 50;
      else if (productType.split(" ").includes(word)) score += 25;
      if (description.split(" ").includes(word)) score += 20;
      if (origin.split(" ").includes(word)) score += 15;
    });
    return score;
  };

  const filterAndSortProducts = () => {
    let filtered = products;
    if (searchTerm) {
      const normalized = normalizeText(searchTerm);
      const words = normalized.split(" ").filter((w) => w.length > 1);
      if (words.length > 0) {
        const scored = products
          .map((p) => ({ product: p, score: calculateRelevanceScore(p, words) }))
          .filter((it) => it.score > 0);
        scored.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.product.name.localeCompare(b.product.name);
        });
        filtered = scored.map((it) => it.product);
      }
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.base_price - b.base_price;
        case "price-high":
          return b.base_price - a.base_price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  };

  const generateSearchSuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    const suggestions = new Set<string>();
    const normalized = normalizeText(searchTerm);
    products.forEach((product) => {
      [
        product.name,
        product.description || "",
        product.product_type || "",
        product.origin || "",
      ].forEach((term) => {
        if (term) {
          normalizeText(term)
            .split(" ")
            .forEach((word) => {
              if (word.startsWith(normalized) && word.length > normalized.length)
                suggestions.add(word);
            });
          if (normalizeText(term).includes(normalized)) suggestions.add(term);
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

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (sortBy !== "name" ? 1 : 0);

  const PageHeader = () => (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <p className="nori-section-title text-primary mb-2">Catalogue</p>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Tous nos ingrédients
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
          Une sélection rigoureuse d'ingrédients sushi, asiatiques et surgelés
          pour les professionnels.
        </p>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <PageHeader />
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
            <ProductGridSkeleton count={8} />
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  const SearchInput = () => (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className="pl-10 h-11 rounded-md bg-card border-border text-foreground placeholder:text-muted-foreground"
        autoComplete="off"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");
            setShowSuggestions(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          aria-label="Effacer la recherche"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 max-h-56 overflow-y-auto rounded-md border border-border bg-card">
          {searchSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSearchSuggestionClick(suggestion)}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-secondary"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageHeader />

        {/* Category pills (horizontal scroll) */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 h-9 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary"
                }`}
              >
                Tout
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`shrink-0 h-9 px-4 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters strip */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          {isMobile ? (
            <div className="flex items-center gap-2 mb-4">
              <SearchInput />
              <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative h-11 px-3 rounded-md border-border bg-card hover:bg-secondary"
                    aria-label="Filtres"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-card border-border">
                  <DrawerHeader>
                    <DrawerTitle className="text-foreground">Filtres</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Catégorie
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full bg-secondary border-border">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Trier par
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full bg-secondary border-border">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="name">Nom A-Z</SelectItem>
                          <SelectItem value="price-low">Prix croissant</SelectItem>
                          <SelectItem value="price-high">Prix décroissant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => setFilterDrawerOpen(false)}
                        className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-xs"
                      >
                        Appliquer
                      </Button>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="flex-1 h-11 border-border bg-transparent hover:bg-secondary"
                        >
                          Effacer
                        </Button>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6">
              <SearchInput />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-11 bg-card border-border">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-11 bg-card border-border">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="name">Nom A-Z</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex bg-card border border-border rounded-md h-11">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`h-full w-11 inline-flex items-center justify-center rounded-l-md ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  aria-label="Grille"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`h-full w-11 inline-flex items-center justify-center rounded-r-md border-l border-border ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  aria-label="Liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-11 px-3 border-border bg-transparent hover:bg-secondary"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          )}

          {/* Active filter chips */}
          {(searchTerm || selectedCategory !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-md border-border text-foreground"
                >
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge
                  variant="outline"
                  className="gap-1 rounded-md border-border text-foreground"
                >
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-primary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-bold text-foreground">{filteredProducts.length}</span>{" "}
            produit{filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Products list/grid */}
          {filteredProducts.length > 0 ? (
            <>
              {/* Mobile: always list view */}
              <div className="md:hidden space-y-2.5">
                {filteredProducts.map((product) => (
                  <ProductListItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.base_price}
                    image={product.image_url || "/placeholder.svg"}
                    unitType={product.unit_type as "kg" | "units" | "g" | "pieces"}
                    inStock={product.stock_quantity ? product.stock_quantity > 0 : true}
                  />
                ))}
              </div>

              {/* Desktop: respect viewMode */}
              <div
                className={
                  viewMode === "grid"
                    ? "hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5"
                    : "hidden md:block space-y-3"
                }
              >
                {filteredProducts.map((product) =>
                  viewMode === "list" ? (
                    <ProductListItem
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.base_price}
                      image={product.image_url || "/placeholder.svg"}
                      unitType={product.unit_type as "kg" | "units" | "g" | "pieces"}
                      inStock={product.stock_quantity ? product.stock_quantity > 0 : true}
                    />
                  ) : (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      description={product.description || ""}
                      price={product.base_price}
                      image={product.image_url || "/placeholder.svg"}
                      unitType={product.unit_type as "kg" | "units" | "g" | "pieces"}
                      inStock={product.stock_quantity ? product.stock_quantity > 0 : true}
                      featured={product.featured || false}
                    />
                  ),
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <Filter className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Essayez de modifier vos critères de recherche.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-border bg-transparent hover:bg-secondary"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
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
