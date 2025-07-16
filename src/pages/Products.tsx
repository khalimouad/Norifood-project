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
import { Search, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterAndSortProducts();
      generateSearchSuggestions();
    }, 100); // Small delay to make search feel immediate but not too heavy
    
    return () => clearTimeout(timeoutId);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true),
        supabase.from("categories").select("*").eq("is_active", true)
      ]);

      console.log("Products loaded:", productsResponse.data?.length);
      console.log("Categories loaded:", categoriesResponse.data?.length);

      if (productsResponse.data) setProducts(productsResponse.data);
      if (categoriesResponse.data) setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const filterAndSortProducts = () => {
    let filtered = products;
    console.log("Filtering products:", products.length, "search term:", searchTerm);

    // Filter by search term with flexible matching
    if (searchTerm) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
      console.log("Search words:", searchWords);
      
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name || '',
          product.description || '',
          product.product_type || '',
          product.origin || '',
          product.unit_type || ''
        ].join(' ');
        
        const normalizedText = normalizeText(searchableText);
        
        // Check if all search words are found in the product text
        const matches = searchWords.every(word => 
          normalizedText.includes(word) || 
          // Also check for partial matches at word boundaries
          normalizedText.split(' ').some(textWord => 
            textWord.startsWith(word) || textWord.includes(word)
          )
        );
        
        if (matches) {
          console.log("Product matches:", product.name, "searchable text:", searchableText);
        }
        
        return matches;
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Sort products
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

    console.log("Filtered products:", filtered.length);
    setFilteredProducts(filtered);
  };

  const generateSearchSuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = new Set<string>();
    const normalizedSearchTerm = normalizeText(searchTerm);
    console.log("Generating suggestions for:", searchTerm, "normalized:", normalizedSearchTerm);
    
    products.forEach(product => {
      const searchableTerms = [
        product.name,
        product.description || '',
        product.product_type || '',
        product.origin || ''
      ];
      
      searchableTerms.forEach(term => {
        if (term) {
          const words = normalizeText(term).split(' ');
          words.forEach(word => {
            if (word.startsWith(normalizedSearchTerm) && word.length > normalizedSearchTerm.length) {
              suggestions.add(word);
            }
          });
          
          // Also add full terms that contain the search
          if (normalizeText(term).includes(normalizedSearchTerm)) {
            suggestions.add(term);
          }
        }
      });
    });
    
    const finalSuggestions = Array.from(suggestions).slice(0, 5);
    console.log("Generated suggestions:", finalSuggestions);
    setSearchSuggestions(finalSuggestions);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </div>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ocean to-ocean-light text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Produits Frais
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Découvrez notre sélection de poissons et fruits de mer de qualité premium
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-ocean/20"
                    autoComplete="off"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                  
                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-48 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSuggestionClick(suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Search className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedCategory !== "all" || sortBy !== "name") && (
                  <Button variant="outline" onClick={clearFilters}>
                    Effacer les filtres
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Filtres actifs:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Recherche: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-600">×</button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-600">×</button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={`${viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
              : "space-y-4"
            } animate-fade-in`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
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
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <Button onClick={clearFilters} variant="outline">
                Effacer tous les filtres
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