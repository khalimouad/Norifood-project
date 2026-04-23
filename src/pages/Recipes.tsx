import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Users, ChefHat, Search, Star, Utensils, Flame, Soup, Fish, Salad, UtensilsCrossed } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import salmonImage from '@/assets/salmon.jpg';

type Recipe = Tables<'recipes'> & {
  featured_image?: string;
};

const categoryIcons = {
  'Tous': UtensilsCrossed,
  'Poisson': Fish,
  'Fruits de mer': Soup,
  'Plat principal': Utensils,
  'Soupe': Soup,
  'Entrée': Salad,
};

const categories = ['Tous', 'Poisson', 'Fruits de mer', 'Plat principal', 'Soupe', 'Entrée'];

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tous' || recipe.difficulty === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredRecipes = recipes.filter(recipe => recipe.featured_image);

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
      case 'facile': 
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium':
      case 'moyen': 
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'hard':
      case 'difficile': 
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: 
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty || 'Facile';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement des recettes...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.01]">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, hsl(var(--secondary)) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, hsl(var(--accent)) 0%, transparent 50%)`
        }}></div>
      </div>

      <Header />
      <main className="pb-20 md:pb-0 relative z-10">
        {/* Elegant Hero Section */}
        <div className="relative overflow-hidden bg-primary text-primary-foreground">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              {/* 3D Icon Effect */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-secondary/30 blur-2xl rounded-full animate-pulse"></div>
                <ChefHat className="relative h-20 w-20 mx-auto drop-shadow-2xl animate-bounce-slow" />
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg">
                Recettes de la Mer
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl opacity-95 max-w-2xl mx-auto font-light">
                Découvrez nos créations culinaires inspirées des saveurs de l'océan
              </p>

              {/* Elegant Search Bar */}
              <div className="max-w-2xl mx-auto pt-4 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-card/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/20">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Rechercher une recette..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-6 py-6 md:py-7 text-base md:text-lg rounded-full border-0 bg-transparent focus-visible:ring-2 focus-visible:ring-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-20">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Elegant Category Pills with 3D Icons */}
          <div className="mb-12 animate-slide-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Explorez par Catégorie
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`group relative px-6 py-4 rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xl scale-105'
                        : 'bg-card hover:bg-muted border border-border hover:border-primary/50 text-foreground hover:scale-105'
                    }`}
                  >
                    {/* 3D Glow Effect */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-50 -z-10 animate-pulse"></div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isSelected 
                          ? 'bg-white/20 shadow-lg' 
                          : 'bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-md'
                      }`}>
                        <Icon className={`h-5 w-5 transition-transform duration-300 ${
                          isSelected ? 'scale-110' : 'group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="font-semibold whitespace-nowrap">{category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Recipes - Elegant Cards */}
          {selectedCategory === 'Tous' && featuredRecipes.length > 0 && (
            <div className="mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-center mb-10">
                <Badge className="mb-4 px-4 py-2 bg-primary text-white text-sm font-semibold">
                  ⭐ Sélection du Chef
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Nos Recettes Vedettes
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {featuredRecipes.slice(0, 2).map((recipe, index) => (
                  <Link 
                    key={recipe.id} 
                    to={`/recipes/${recipe.slug}`}
                    className="group block animate-zoom-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-full">
                      {/* 3D Card Effect */}
                      <div className="absolute inset-0 bg-primary/15 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 transform group-hover:scale-110"></div>
                      
                      <Card className="h-full overflow-hidden border-2 border-border bg-card hover:border-primary/50 transition-all duration-500 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
                        <div className="relative h-72 md:h-80 overflow-hidden">
                          <img
                            src={recipe.featured_image || salmonImage}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                          
                          {/* Floating Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-white shadow-2xl backdrop-blur-sm px-4 py-2 text-sm font-bold">
                              ⭐ Vedette
                            </Badge>
                          </div>
                          
                          {/* Rating */}
                          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-md rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xl">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold">4.8</span>
                          </div>

                          {/* Title Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                              {recipe.title}
                            </h3>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{recipe.servings || 2} pers.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`${getDifficultyColor(recipe.difficulty)} font-semibold`}>
                              {getDifficultyLabel(recipe.difficulty)}
                            </Badge>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all">
                              Voir la recette →
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Recipes Grid - Modern 3D Cards */}
          <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              {selectedCategory === 'Tous' ? 'Toutes nos Recettes' : `Recettes ${selectedCategory}`}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <Link 
                  key={recipe.id} 
                  to={`/recipes/${recipe.slug}`}
                  className="group block animate-zoom-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="relative h-full">
                    {/* 3D Hover Glow */}
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    <Card className="h-full overflow-hidden border border-border bg-card hover:border-primary/30 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={recipe.featured_image || salmonImage}
                          alt={recipe.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {recipe.featured_image && (
                          <Badge className="absolute top-3 left-3 bg-primary text-white text-xs shadow-lg">
                            ⭐
                          </Badge>
                        )}
                        
                        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-md rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {recipe.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)}min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{recipe.servings || 2}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                            {getDifficultyLabel(recipe.difficulty)}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md group-hover:shadow-lg transition-all"
                        >
                          Voir →
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredRecipes.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucune recette trouvée
                </h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Tous');
                  }}
                  className="hover:scale-105 transition-transform"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Recipes;