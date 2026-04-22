import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat, ArrowLeft, ShoppingCart, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Recipe = Tables<'recipes'>;
type Product = Tables<'products'>;

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchRecipe();
    }
  }, [slug]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (recipeError) throw recipeError;
      setRecipe(recipeData);

      // Fetch related products
      const { data: productsData } = await supabase
        .from('recipe_products')
        .select('product_id, products(*)')
        .eq('recipe_id', recipeData.id);

      if (productsData) {
        setProducts(productsData.map(rp => rp.products).filter(Boolean) as Product[]);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-8 text-center">
            <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Recette introuvable</h1>
            <Link to="/recipes">
              <Button>Retour aux recettes</Button>
            </Link>
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
        {/* Elegant Hero with Parallax Effect */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={recipe.featured_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200'}
              alt={recipe.title}
              className="w-full h-full object-cover scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 pb-12 md:pb-16 space-y-6 animate-fade-in">
              <Link 
                to="/recipes" 
                className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Retour aux recettes</span>
              </Link>

              <div className="max-w-4xl space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
                  {recipe.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} px-4 py-2 text-sm font-bold shadow-xl`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </Badge>
                  
                  <div className="flex items-center gap-6 text-white">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                      <Clock className="h-5 w-5" />
                      <span className="font-semibold">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold">{recipe.servings || 2} personnes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              {recipe.description && (
                <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow animate-fade-in">
                  <p className="text-muted-foreground text-lg leading-relaxed">{recipe.description}</p>
                </div>
              )}

              {/* Ingredients Card with 3D Effect */}
              <div className="relative group animate-slide-in" style={{ animationDelay: '100ms' }}>
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary rounded-2xl shadow-lg">
                      <Utensils className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Ingrédients</h2>
                  </div>
                  <ul className="space-y-3">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group/item">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions Card with 3D Effect */}
              <div className="relative group animate-slide-in" style={{ animationDelay: '200ms' }}>
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary rounded-2xl shadow-lg">
                      <ChefHat className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Préparation</h2>
                  </div>
                  <ol className="space-y-6">
                    {recipe.instructions?.map((instruction, index) => (
                      <li key={index} className="flex gap-4 group/step">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover/step:scale-110 transition-transform">
                            {index + 1}
                          </div>
                        </div>
                        <p className="text-muted-foreground pt-2 leading-relaxed group-hover/step:text-foreground transition-colors">
                          {instruction}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Time Info Card with 3D Effect */}
              <div className="relative group animate-zoom-in" style={{ animationDelay: '300ms' }}>
                <div className="absolute inset-0 bg-primary/15 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all sticky top-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Temps de préparation</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground text-sm">Préparation</span>
                      <span className="font-bold text-foreground">{recipe.prep_time || 0} min</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="text-muted-foreground text-sm">Cuisson</span>
                      <span className="font-bold text-foreground">{recipe.cook_time || 0} min</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-primary rounded-xl shadow-lg">
                      <span className="text-primary-foreground font-bold">Total</span>
                      <span className="text-primary-foreground font-bold text-xl">{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Products Card with 3D Effect */}
              {products.length > 0 && (
                <div className="relative group animate-zoom-in" style={{ animationDelay: '400ms' }}>
                  <div className="absolute inset-0 bg-primary/15 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                  <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-secondary/10 rounded-xl">
                        <ShoppingCart className="h-5 w-5 text-secondary" />
                      </div>
                      <h3 className="font-bold text-foreground text-lg">Produits recommandés</h3>
                    </div>
                    <div className="space-y-3">
                      {products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.slug}`}
                          className="group/product flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-primary/20"
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={product.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100'}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-xl shadow-md group-hover/product:shadow-lg transition-shadow"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/product:opacity-100 transition-opacity"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate group-hover/product:text-primary transition-colors">
                              {product.name}
                            </p>
                            <p className="text-primary font-bold text-base">{product.price} DH</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default RecipeDetail;
