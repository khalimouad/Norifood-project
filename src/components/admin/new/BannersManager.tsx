import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Banner = Tables<'banners'>;

export function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '',
    link_url: '',
    button_text: '',
    position: 0,
    is_active: true,
    show_on_desktop: true,
    show_on_mobile: true,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les bannières',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const bannerData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      if (selectedBanner) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', selectedBanner.id);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Bannière modifiée avec succès'
        });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Bannière créée avec succès'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la bannière',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      mobile_image_url: banner.mobile_image_url || '',
      link_url: banner.link_url || '',
      button_text: banner.button_text || '',
      position: banner.position || 0,
      is_active: banner.is_active || false,
      show_on_desktop: banner.show_on_desktop || false,
      show_on_mobile: banner.show_on_mobile || false,
      start_date: banner.start_date || '',
      end_date: banner.end_date || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Succès',
        description: 'Bannière supprimée avec succès'
      });
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la bannière',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      mobile_image_url: '',
      link_url: '',
      button_text: '',
      position: 0,
      is_active: true,
      show_on_desktop: true,
      show_on_mobile: true,
      start_date: '',
      end_date: ''
    });
    setSelectedBanner(null);
  };

  const handleNewBanner = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bannières</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewBanner}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle bannière
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la bannière"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Sous-titre (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="image_url">URL de l'image</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="URL de l'image"
                />
              </div>

              <div>
                <Label htmlFor="mobile_image_url">URL de l'image mobile</Label>
                <Input
                  id="mobile_image_url"
                  value={formData.mobile_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile_image_url: e.target.value }))}
                  placeholder="URL de l'image mobile (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="link_url">URL du lien</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="URL de redirection (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="button_text">Texte du bouton</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Texte du bouton (optionnel)"
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                  placeholder="Position d'affichage"
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_on_desktop"
                  checked={formData.show_on_desktop}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_desktop: checked }))}
                />
                <Label htmlFor="show_on_desktop">Afficher sur desktop</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_on_mobile"
                  checked={formData.show_on_mobile}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_on_mobile: checked }))}
                />
                <Label htmlFor="show_on_mobile">Afficher sur mobile</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  {selectedBanner ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {banner.title}
                  <Badge variant={banner.is_active ? "default" : "secondary"}>
                    {banner.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Position:</strong> {banner.position}
                </div>
                <div>
                  <strong>Sous-titre:</strong> {banner.subtitle || 'Aucun'}
                </div>
                <div>
                  <strong>Desktop:</strong> {banner.show_on_desktop ? 'Oui' : 'Non'}
                </div>
                <div>
                  <strong>Mobile:</strong> {banner.show_on_mobile ? 'Oui' : 'Non'}
                </div>
                <div>
                  <strong>Date début:</strong> {banner.start_date ? new Date(banner.start_date).toLocaleDateString() : 'Aucune'}
                </div>
                <div>
                  <strong>Date fin:</strong> {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : 'Aucune'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}