import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tag, Plus, Edit, Palette } from 'lucide-react';

interface TagData {
  id: string;
  name: string;
  slug: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const colorOptions = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export function TagsManager() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les étiquettes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingTag) {
        const { error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', editingTag.id);

        if (error) throw error;

        toast({
          title: "Étiquette modifiée",
          description: `"${formData.name}" a été modifiée avec succès`,
        });
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([tagData]);

        if (error) throw error;

        toast({
          title: "Étiquette créée",
          description: `"${formData.name}" a été créée avec succès`,
        });
      }

      setIsDialogOpen(false);
      setEditingTag(null);
      setFormData({ name: '', color: '#3B82F6', is_active: true });
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'étiquette",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tag: TagData) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      is_active: tag.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tag: TagData) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'étiquette "${tag.name}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      toast({
        title: "Étiquette supprimée",
        description: `"${tag.name}" a été supprimée avec succès`,
      });

      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étiquette",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setEditingTag(null);
    setFormData({ name: '', color: '#3B82F6', is_active: true });
    setIsDialogOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      sortable: true,
      render: (value: string, row: TagData) => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'color',
      label: 'Couleur',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md border"
            style={{ backgroundColor: value }}
          />
          <Badge variant="outline" className="font-mono text-xs">
            {value}
          </Badge>
        </div>
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
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Actif' : 'Inactif'}
        </Badge>
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
        title="Gestion des étiquettes"
        description="Gérez les étiquettes pour organiser vos produits"
        columns={columns}
        data={tags}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchTags}
        searchPlaceholder="Rechercher une étiquette..."
        addButtonText="Nouvelle étiquette"
        emptyMessage="Aucune étiquette trouvée"
        exportFileName="etiquettes"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Modifier l\'étiquette' : 'Nouvelle étiquette'}
            </DialogTitle>
            <DialogDescription>
              {editingTag 
                ? 'Modifiez les informations de l\'étiquette'
                : 'Créez une nouvelle étiquette pour organiser vos produits'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'étiquette</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Bio, Frais, Promotion..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-md border-2 ${
                      formData.color === color ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Étiquette active</Label>
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
                {editingTag ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}