import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Banner = Tables<'banners'>;

export function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEdit = (banner: Banner) => {
    navigate(`/admin-new/banner/${banner.id}`);
  };

  const handleNewBanner = () => {
    navigate('/admin-new/banner/new');
  };

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


  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bannières</h2>
        <Button onClick={handleNewBanner}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle bannière
        </Button>
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