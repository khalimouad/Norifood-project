import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChefHat, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Recipe = Tables<'recipes'>;

export function RecipesManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prep_time: '',
    cook_time: '',
    servings: '',
    difficulty: '',
    featured_image: '',
    images: [''],
    is_published: false
  });

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
        title: 'Erreur',
        description: 'Impossible de charger les recettes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const recipeData = {
        ...formData,
        prep_time: formData.prep_time ? parseInt(formData.prep_time) : null,
        cook_time: formData.cook_time ? parseInt(formData.cook_time) : null,
        servings: formData.servings ? parseInt(formData.servings) : null,
        ingredients: formData.ingredients.filter(i => i.trim() !== ''),
        instructions: formData.instructions.filter(i => i.trim() !== ''),
        images: formData.images.filter(i => i.trim() !== '')
      };

      if (selectedRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', selectedRecipe.id);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Recette modifiée avec succès'
        });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Recette créée avec succès'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la recette',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      title: recipe.title,
      slug: recipe.slug,
      description: recipe.description || '',
      ingredients: recipe.ingredients || [''],
      instructions: recipe.instructions || [''],
      prep_time: recipe.prep_time?.toString() || '',
      cook_time: recipe.cook_time?.toString() || '',
      servings: recipe.servings?.toString() || '',
      difficulty: recipe.difficulty || '',
      featured_image: recipe.featured_image || '',
      images: recipe.images || [''],
      is_published: recipe.is_published || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Succès',
        description: 'Recette supprimée avec succès'
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la recette',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      ingredients: [''],
      instructions: [''],
      prep_time: '',
      cook_time: '',
      servings: '',
      difficulty: '',
      featured_image: '',
      images: [''],
      is_published: false
    });
    setSelectedRecipe(null);
  };

  const handleNewRecipe = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recettes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewRecipe}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle recette
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedRecipe ? 'Modifier la recette' : 'Nouvelle recette'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de la recette"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="slug-de-la-recette"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la recette"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prep_time">Temps de préparation (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    value={formData.prep_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, prep_time: e.target.value }))}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="cook_time">Temps de cuisson (min)</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    value={formData.cook_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, cook_time: e.target.value }))}
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Nombre de portions</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                    placeholder="4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Input
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    placeholder="Facile, Moyenne, Difficile"
                  />
                </div>
                <div>
                  <Label htmlFor="featured_image">Image principale</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                    placeholder="URL de l'image"
                  />
                </div>
              </div>

              <div>
                <Label>Ingrédients</Label>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => {
                          const newIngredients = [...formData.ingredients];
                          newIngredients[index] = e.target.value;
                          setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                        }}
                        placeholder="Ingrédient"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addIngredient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un ingrédient
                  </Button>
                </div>
              </div>

              <div>
                <Label>Instructions</Label>
                <div className="space-y-2">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...formData.instructions];
                          newInstructions[index] = e.target.value;
                          setFormData(prev => ({ ...prev, instructions: newInstructions }));
                        }}
                        placeholder="Étape d'instruction"
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addInstruction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une instruction
                  </Button>
                </div>
              </div>

              <div>
                <Label>Images supplémentaires</Label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        placeholder="URL de l'image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une image
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publié</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  {selectedRecipe ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  {recipe.title}
                  <Badge variant={recipe.is_published ? "default" : "secondary"}>
                    {recipe.is_published ? 'Publié' : 'Brouillon'}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <strong>Préparation:</strong> {recipe.prep_time || 0} min
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <strong>Cuisson:</strong> {recipe.cook_time || 0} min
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <strong>Portions:</strong> {recipe.servings || 0}
                </div>
                <div>
                  <strong>Difficulté:</strong> {recipe.difficulty || 'Non spécifiée'}
                </div>
              </div>
              {recipe.description && (
                <p className="mt-2 text-sm text-muted-foreground">{recipe.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}