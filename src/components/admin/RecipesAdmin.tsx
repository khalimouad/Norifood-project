import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  featured_image: string;
  images: string[];
  is_published: boolean;
  created_at: string;
}

export const RecipesAdmin = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    ingredients: [""],
    instructions: [""],
    prep_time: 0,
    cook_time: 0,
    servings: 0,
    difficulty: "easy",
    featured_image: "",
    images: [""],
    is_published: false,
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-recipes', {
        method: 'GET'
      });
      if (error) throw error;
      setRecipes(Array.isArray(data) ? data : (data?.recipes || []));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les recettes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingRecipe ? `manage-recipes?id=${editingRecipe.id}` : 'manage-recipes';
      
      const cleanData = {
        ...formData,
        ingredients: formData.ingredients.filter(i => i.trim() !== ""),
        instructions: formData.instructions.filter(i => i.trim() !== ""),
        images: formData.images.filter(i => i.trim() !== ""),
      };
      
      const { error } = await supabase.functions.invoke(endpoint, {
        method: editingRecipe ? 'PUT' : 'POST',
        body: cleanData,
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: editingRecipe ? "Recette modifiée" : "Recette créée",
      });
      
      setIsDialogOpen(false);
      setEditingRecipe(null);
      resetForm();
      fetchRecipes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la recette",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) return;
    
    try {
      const { error } = await supabase.functions.invoke(`manage-recipes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Recette supprimée",
      });
      
      fetchRecipes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recette",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      ingredients: [""],
      instructions: [""],
      prep_time: 0,
      cook_time: 0,
      servings: 0,
      difficulty: "easy",
      featured_image: "",
      images: [""],
      is_published: false,
    });
  };

  const openEditDialog = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      slug: recipe.slug,
      description: recipe.description || "",
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [""],
      instructions: recipe.instructions.length > 0 ? recipe.instructions : [""],
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 0,
      difficulty: recipe.difficulty || "easy",
      featured_image: recipe.featured_image || "",
      images: recipe.images && recipe.images.length > 0 ? recipe.images : [""],
      is_published: recipe.is_published,
    });
    setIsDialogOpen(true);
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const removeIngredient = (index: number) => {
    setFormData({ 
      ...formData, 
      ingredients: formData.ingredients.filter((_, i) => i !== index) 
    });
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ""] });
  };

  const removeInstruction = (index: number) => {
    setFormData({ 
      ...formData, 
      instructions: formData.instructions.filter((_, i) => i !== index) 
    });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recettes ({recipes.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingRecipe(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une recette
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? "Modifier la recette" : "Ajouter une recette"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Ingrédients</Label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index] = e.target.value;
                        setFormData({ ...formData, ingredients: newIngredients });
                      }}
                      placeholder="Ingrédient"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addIngredient}>
                  Ajouter un ingrédient
                </Button>
              </div>
              
              <div>
                <Label>Instructions</Label>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.instructions];
                        newInstructions[index] = e.target.value;
                        setFormData({ ...formData, instructions: newInstructions });
                      }}
                      placeholder="Instruction"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addInstruction}>
                  Ajouter une instruction
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="prep_time">Temps de préparation (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    value={formData.prep_time}
                    onChange={(e) => setFormData({ ...formData, prep_time: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="cook_time">Temps de cuisson (min)</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    value={formData.cook_time}
                    onChange={(e) => setFormData({ ...formData, cook_time: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="servings">Portions</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Facile</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="hard">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="featured_image">Image principale</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Publié</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingRecipe ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{recipe.title}</h3>
                    {!recipe.is_published && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                        Brouillon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{recipe.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span>Préparation: {recipe.prep_time}min</span>
                    <span>Cuisson: {recipe.cook_time}min</span>
                    <span>Portions: {recipe.servings}</span>
                    <span>Difficulté: {recipe.difficulty}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(recipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};