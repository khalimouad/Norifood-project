import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Users, ChefHat, Search, Star, Filter } from 'lucide-react';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: string;
  rating: number;
  featured: boolean;
}

const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Saumon Grillé aux Herbes',
    description: 'Un délicieux saumon grillé avec un mélange d\'herbes fraîches et citron',
    image: salmonImage,
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Facile',
    category: 'Poisson',
    rating: 4.8,
    featured: true
  },
  {
    id: '2',
    title: 'Crevettes à l\'Ail et Persil',
    description: 'Crevettes sautées avec ail, persil et huile d\'olive',
    image: shrimpImage,
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    difficulty: 'Facile',
    category: 'Fruits de mer',
    rating: 4.6,
    featured: true
  },
  {
    id: '3',
    title: 'Tajine de Poisson Marocain',
    description: 'Poisson mijoté aux légumes et épices marocaines traditionnelles',
    image: wholeFishImage,
    prepTime: 20,
    cookTime: 45,
    servings: 6,
    difficulty: 'Moyen',
    category: 'Plat principal',
    rating: 4.9,
    featured: false
  },
  {
    id: '4',
    title: 'Bouillabaisse Traditionnelle',
    description: 'La célèbre soupe de poisson provençale avec rouille',
    image: wholeFishImage,
    prepTime: 30,
    cookTime: 60,
    servings: 8,
    difficulty: 'Difficile',
    category: 'Soupe',
    rating: 4.7,
    featured: false
  }
];

const categories = ['Tous', 'Poisson', 'Fruits de mer', 'Plat principal', 'Soupe', 'Entrée'];

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredRecipes = recipes.filter(recipe => recipe.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ocean to-ocean-light text-white py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-seafoam" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Nos Recettes de la Mer
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez des recettes délicieuses pour sublimer nos produits frais
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 rounded-full border-gray-200"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Recipes */}
          {selectedCategory === 'Tous' && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Recettes Vedettes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-coral text-white">
                        Vedette
                      </Badge>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{recipe.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings} pers.</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                      <Button className="w-full" size="sm">
                        Voir la Recette
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Recipes */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              {selectedCategory === 'Tous' ? 'Toutes nos Recettes' : `Recettes ${selectedCategory}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {recipe.featured && (
                      <Badge className="absolute top-2 left-2 bg-coral text-white text-xs">
                        Vedette
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{recipe.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1 line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{recipe.prepTime + recipe.cookTime}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{recipe.servings}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <Button className="w-full" size="sm">
                      Voir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune recette trouvée
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Tous');
                  }}
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