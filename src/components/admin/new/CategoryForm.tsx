import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '../ImageUpload';
import { 
  Fish, 
  Waves, 
  ShoppingCart, 
  Star, 
  Zap, 
  Heart, 
  Sparkles, 
  Crown, 
  Gem, 
  Award,
  Anchor,
  Shell,
  Droplet,
  Flame,
  Apple,
  Carrot,
  Leaf,
  Package,
  Beef,
  Sandwich,
  Soup,
  UtensilsCrossed
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  image_url: string;
  icon?: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onSaved: () => void;
  onCancel: () => void;
}

const iconOptions = [
  { value: 'apple', label: 'Fruits', icon: Apple },
  { value: 'carrot', label: 'Légumes', icon: Carrot },
  { value: 'leaf', label: 'Fruits et légumes', icon: Leaf },
  { value: 'fish', label: 'Filets de poisson', icon: Fish },
  { value: 'flame', label: 'Poisson fumés', icon: Flame },
  { value: 'waves', label: 'Poissons frais', icon: Waves },
  { value: 'package', label: 'Poissons embalés', icon: Package },
  { value: 'shell', label: 'Fruits de mers', icon: Shell },
  { value: 'anchor', label: 'Crevettes', icon: Anchor },
  { value: 'droplet', label: 'Calamars', icon: Droplet },
  { value: 'beef', label: 'Nuggets', icon: Beef },
  { value: 'soup', label: 'Pasta', icon: Soup },
  { value: 'utensils-crossed', label: 'Produits élaborés', icon: UtensilsCrossed },
  { value: 'star', label: 'Étoile', icon: Star },
  { value: 'heart', label: 'Cœur', icon: Heart },
  { value: 'sparkles', label: 'Étincelles', icon: Sparkles },
  { value: 'crown', label: 'Couronne', icon: Crown },
  { value: 'gem', label: 'Gemme', icon: Gem },
  { value: 'award', label: 'Récompense', icon: Award },
  { value: 'zap', label: 'Éclair', icon: Zap },
  { value: 'shopping-cart', label: 'Panier', icon: ShoppingCart },
];

export function CategoryForm({ category, onSaved, onCancel }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    icon: 'fish',
    is_active: true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image_url: category.image_url || '',
        icon: category.icon || 'apple',
        is_active: category.is_active ?? true,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Catégorie modifiée avec succès",
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
      }

      onSaved();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la catégorie</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icône</Label>
        <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une icône" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <ImageUpload
        onImageSelect={(imageData) => setFormData({ ...formData, image_url: imageData })}
        currentImage={formData.image_url}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Catégorie active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (category ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}