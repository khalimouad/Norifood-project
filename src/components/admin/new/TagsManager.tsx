import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Tag = Tables<'tags'>;

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3B82F6',
    is_active: true
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les tags',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedTag) {
        const { error } = await supabase
          .from('tags')
          .update(formData)
          .eq('id', selectedTag.id);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Tag modifié avec succès'
        });
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Tag créé avec succès'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le tag',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color || '#3B82F6',
      is_active: tag.is_active || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Succès',
        description: 'Tag supprimé avec succès'
      });
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le tag',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      color: '#3B82F6',
      is_active: true
    });
    setSelectedTag(null);
  };

  const handleNewTag = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tags</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTag}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTag ? 'Modifier le tag' : 'Nouveau tag'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du tag"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-du-tag"
                />
              </div>

              <div>
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Actif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  {selectedTag ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tags.map((tag) => (
          <Card key={tag.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" style={{ color: tag.color || '#3B82F6' }} />
                  {tag.name}
                  <Badge variant={tag.is_active ? "default" : "secondary"}>
                    {tag.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <strong>Slug:</strong> {tag.slug}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}