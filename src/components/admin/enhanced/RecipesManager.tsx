import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
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
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
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


  const handleDelete = async (recipe: Recipe) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "La recette a été supprimée",
      });
      
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
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
      render: (value: any, recipe: Recipe) => (
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
      render: (value: any, recipe: Recipe) => (
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
      render: (value: any, recipe: Recipe) => (
        <div className="text-sm">
          <div>Préparation: {recipe.prep_time}min</div>
          <div>Cuisson: {recipe.cook_time}min</div>
        </div>
      )
    },
    {
      key: 'servings',
      label: 'Portions',
      render: (value: any, recipe: Recipe) => (
        <Badge variant="outline">{recipe.servings} pers.</Badge>
      )
    },
    {
      key: 'difficulty',
      label: 'Difficulté',
      render: (value: any, recipe: Recipe) => getDifficultyBadge(recipe.difficulty)
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: any, recipe: Recipe) => (
        <Badge variant={recipe.is_published ? "default" : "secondary"}>
          {recipe.is_published ? 'Publié' : 'Brouillon'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <EnhancedTable
        title="Recettes"
        description="Gérer les recettes culinaires"
        data={recipes}
        columns={columns}
        loading={loading}
        onRefresh={fetchRecipes}
        onAdd={() => navigate('/admin/recipes/new')}
        onEdit={(recipe) => navigate(`/admin/recipes/${recipe.id}`)}
        onDelete={handleDelete}
        addButtonText="Nouvelle recette"
        searchPlaceholder="Rechercher par titre..."
      />
    </div>
  );
}