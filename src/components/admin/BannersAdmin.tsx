import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string;
  link_url: string;
  button_text: string;
  position: number;
  is_active: boolean;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const BannersAdmin = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    mobile_image_url: "",
    link_url: "",
    button_text: "",
    position: 0,
    is_active: true,
    show_on_mobile: true,
    show_on_desktop: true,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-banners');
      if (error) throw error;
      setBanners(Array.isArray(data) ? data : (data?.banners || []));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les bannières",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingBanner ? `manage-banners?id=${editingBanner.id}` : 'manage-banners';
      
      const { error } = await supabase.functions.invoke(endpoint, {
        method: editingBanner ? 'PUT' : 'POST',
        body: formData,
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: editingBanner ? "Bannière modifiée" : "Bannière créée",
      });
      
      setIsDialogOpen(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la bannière",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette bannière ?")) return;
    
    try {
      const { error } = await supabase.functions.invoke(`manage-banners?id=${id}`);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Bannière supprimée",
      });
      
      fetchBanners();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la bannière",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      mobile_image_url: "",
      link_url: "",
      button_text: "",
      position: 0,
      is_active: true,
      show_on_mobile: true,
      show_on_desktop: true,
      start_date: "",
      end_date: "",
    });
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      mobile_image_url: banner.mobile_image_url || "",
      link_url: banner.link_url || "",
      button_text: banner.button_text || "",
      position: banner.position,
      is_active: banner.is_active,
      show_on_mobile: banner.show_on_mobile,
      show_on_desktop: banner.show_on_desktop,
      start_date: banner.start_date ? new Date(banner.start_date).toISOString().split('T')[0] : "",
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : "",
    });
    setIsDialogOpen(true);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bannières ({banners.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingBanner(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une bannière
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Modifier la bannière" : "Ajouter une bannière"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">URL de l'image</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="mobile_image_url">URL de l'image mobile</Label>
                <Input
                  id="mobile_image_url"
                  value={formData.mobile_image_url}
                  onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link_url">URL du lien</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="button_text">Texte du bouton</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date de début</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Date de fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_on_mobile"
                    checked={formData.show_on_mobile}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_mobile: checked })}
                  />
                  <Label htmlFor="show_on_mobile">Afficher sur mobile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_on_desktop"
                    checked={formData.show_on_desktop}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_on_desktop: checked })}
                  />
                  <Label htmlFor="show_on_desktop">Afficher sur desktop</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingBanner ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{banner.title}</h3>
                    {!banner.is_active && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{banner.subtitle}</p>
                  <div className="flex gap-4 text-sm">
                    <span>Position: {banner.position}</span>
                    <span>Mobile: {banner.show_on_mobile ? 'Oui' : 'Non'}</span>
                    <span>Desktop: {banner.show_on_desktop ? 'Oui' : 'Non'}</span>
                  </div>
                  {banner.start_date && banner.end_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Période: {new Date(banner.start_date).toLocaleDateString()} - {new Date(banner.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
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