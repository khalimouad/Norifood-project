import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '../ImageUpload';
import type { Tables } from '@/integrations/supabase/types';

type Banner = Tables<'banners'>;

export function BannerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    if (id && id !== 'new') {
      fetchBanner();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchBanner = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBanner(data);
      setFormData({
        title: data.title,
        subtitle: data.subtitle || '',
        image_url: data.image_url,
        mobile_image_url: data.mobile_image_url || '',
        link_url: data.link_url || '',
        button_text: data.button_text || '',
        position: data.position || 0,
        is_active: data.is_active || false,
        show_on_desktop: data.show_on_desktop || false,
        show_on_mobile: data.show_on_mobile || false,
        start_date: data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : '',
        end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : ''
      });
    } catch (error) {
      console.error('Error fetching banner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la bannière",
        variant: "destructive",
      });
      navigate('/admin-new');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const bannerData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', id);

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

      navigate('/admin-new');
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la bannière',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-new');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {id === 'new' ? 'Nouvelle bannière' : 'Modifier la bannière'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {id === 'new' ? 'Créer une nouvelle bannière' : `Modifier: ${banner?.title}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la bannière"
                  required
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

              <ImageUpload
                onImageSelect={(imageData) => setFormData(prev => ({ ...prev, image_url: imageData }))}
                currentImage={formData.image_url}
              />

              <div>
                <Label>Image mobile (optionnel)</Label>
                <ImageUpload
                  onImageSelect={(imageData) => setFormData(prev => ({ ...prev, mobile_image_url: imageData }))}
                  currentImage={formData.mobile_image_url}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Sauvegarde...' : (id === 'new' ? 'Créer' : 'Modifier')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}