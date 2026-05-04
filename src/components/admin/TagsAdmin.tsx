import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export const TagsAdmin = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "#3B82F6",
    is_active: true,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      if (error) throw error;
      setTags((data ?? []) as any);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les étiquettes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = editingTag
        ? await supabase.from('tags').update(formData).eq('id', editingTag.id)
        : await supabase.from('tags').insert(formData);
      if (error) throw error;
      toast({
        title: 'Succès',
        description: editingTag ? 'Étiquette modifiée' : 'Étiquette créée',
      });
      setIsDialogOpen(false);
      setEditingTag(null);
      resetForm();
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de sauvegarder l'étiquette",
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) return;
    try {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Succès', description: 'Étiquette supprimée' });
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'étiquette",
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      color: "#3B82F6",
      is_active: true,
    });
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      is_active: tag.is_active,
    });
    setIsDialogOpen(true);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Étiquettes ({tags.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingTag(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une étiquette
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Modifier l'étiquette" : "Ajouter une étiquette"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              
              <div>
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Actif</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingTag ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tags.map((tag) => (
          <Card key={tag.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <h3 className="font-semibold">{tag.name}</h3>
                    {!tag.is_active && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Slug: {tag.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(tag)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tag.id)}
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