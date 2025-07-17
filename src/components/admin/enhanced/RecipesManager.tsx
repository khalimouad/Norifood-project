import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  description: string;
  featured_image: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  is_published: boolean;
  created_at: string;
  ingredients: string[];
  instructions: string[];
}

export function RecipesManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les recettes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyMap = {
      'easy': { label: 'Facile', variant: 'default' as const },
      'medium': { label: 'Moyen', variant: 'secondary' as const },
      'hard': { label: 'Difficile', variant: 'destructive' as const },
    };
    
    const difficultyInfo = difficultyMap[difficulty as keyof typeof difficultyMap] || 
                          { label: difficulty, variant: 'outline' as const };
    return <Badge variant={difficultyInfo.variant}>{difficultyInfo.label}</Badge>;
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (recipe: Recipe) => (
        recipe.featured_image ? (
          <img 
            src={recipe.featured_image} 
            alt={recipe.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
            <span className="text-muted-foreground text-xs">Pas d'image</span>
          </div>
        )
      )
    },
    {
      key: 'title',
      label: 'Titre',
      render: (recipe: Recipe) => (
        <div>
          <div className="font-medium">{recipe.title}</div>
          {recipe.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'timing',
      label: 'Temps',
      render: (recipe: Recipe) => (
        <div className="text-sm">
          <div>Préparation: {recipe.prep_time}min</div>
          <div>Cuisson: {recipe.cook_time}min</div>
        </div>
      )
    },
    {
      key: 'servings',
      label: 'Portions',
      render: (recipe: Recipe) => (
        <Badge variant="outline">{recipe.servings} pers.</Badge>
      )
    },
    {
      key: 'difficulty',
      label: 'Difficulté',
      render: (recipe: Recipe) => getDifficultyBadge(recipe.difficulty)
    },
    {
      key: 'status',
      label: 'Statut',
      render: (recipe: Recipe) => (
        <Badge variant={recipe.is_published ? "default" : "secondary"}>
          {recipe.is_published ? 'Publié' : 'Brouillon'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (recipe: Recipe) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recettes</h2>
          <p className="text-muted-foreground">Gérer les recettes culinaires</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <EnhancedTable
        title="Recettes"
        description="Gérer les recettes culinaires"
        data={filteredRecipes}
        columns={columns}
        loading={loading}
        onRefresh={fetchRecipes}
      />
    </div>
  );
}