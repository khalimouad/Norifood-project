import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable, StatusBadge } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag, Image as ImageIcon } from 'lucide-react';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image_url?: string;
  custom_svg?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const iconOptions = [
  'fish', 'shrimp', 'crab', 'lobster', 'oyster', 'squid', 'octopus',
  'salmon', 'tuna', 'cod', 'seabass', 'mackerel', 'sardine'
];

export function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fish',
    image_url: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Catégorie modifiée",
          description: `"${formData.name}" a été modifiée avec succès`,
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;

        toast({
          title: "Catégorie créée",
          description: `"${formData.name}" a été créée avec succès`,
        });
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: 'fish', image_url: '', is_active: true });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon,
      image_url: category.image_url || '',
      is_active: category.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (category: CategoryData) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Catégorie supprimée",
        description: `"${category.name}" a été supprimée avec succès`,
      });

      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: 'fish', image_url: '', is_active: true });
    setIsDialogOpen(true);
  };

  const columns = [
    {
      key: 'image_url',
      label: 'Image',
      render: (value: string, row: CategoryData) => (
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt="Category" className="w-full h-full object-cover" />
          ) : (
            <Tag className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Nom',
      sortable: true,
      render: (value: string, row: CategoryData) => (
        <div>
          <span className="font-medium">{value}</span>
          {row.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'icon',
      label: 'Icône',
      render: (value: string) => (
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      filterable: true,
      filterOptions: [
        { value: 'true', label: 'Actif' },
        { value: 'false', label: 'Inactif' },
      ],
      render: (value: boolean) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'created_at',
      label: 'Créé le',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <EnhancedTable
        title="Gestion des catégories"
        description="Gérez les catégories de produits"
        columns={columns}
        data={categories}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchCategories}
        searchPlaceholder="Rechercher une catégorie..."
        addButtonText="Nouvelle catégorie"
        emptyMessage="Aucune catégorie trouvée"
        exportFileName="categories"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Modifiez les informations de la catégorie'
                : 'Créez une nouvelle catégorie de produits'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Poissons frais"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la catégorie"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Catégorie active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingCategory ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}