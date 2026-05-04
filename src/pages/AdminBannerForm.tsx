import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';

const bannerFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  subtitle: z.string().optional(),
  image_url: z.string().min(1, 'L\'image est requise'),
  mobile_image_url: z.string().optional(),
  link_url: z.string().optional(),
  button_text: z.string().optional(),
  position: z.number().min(0),
  is_active: z.boolean().default(true),
  show_on_desktop: z.boolean().default(true),
  show_on_mobile: z.boolean().default(true),
});

export default function AdminBannerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (id) {
      fetchBanner();
    }
  }, [id]);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        form.reset(data);
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la bannière",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof bannerFormSchema>) => {
    setLoading(true);
    try {
      if (id) {
        const { error } = await supabase
          .from('banners')
          .update(data)
          .eq('id', id);
        if (error) throw error;
        toast({ title: "Succès", description: "Bannière mise à jour" });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([data]);
        if (error) throw error;
        toast({ title: "Succès", description: "Bannière créée" });
      }
      navigate('/admin/banners');
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la bannière",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const first = Object.values(errors)[0];
    const message = first?.message ?? 'Veuillez vérifier les champs en rouge.';
    console.warn('Banner form validation errors:', errors);
    toast({
      title: 'Formulaire incomplet',
      description: message,
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/banners')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {id ? 'Modifier la bannière' : 'Nouvelle bannière'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Informations générales</h2>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sous-titre</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="link_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lien URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="button_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texte du bouton</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Ordre d'affichage (0 = premier)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Images</h2>

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Desktop</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        bucket="banners"
                      />
                    </FormControl>
                    <FormDescription>Recommandé: 1920x1080px (16:9)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Mobile (Optionnel)</FormLabel>
                    <FormControl>
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        bucket="banners"
                      />
                    </FormControl>
                    <FormDescription>Recommandé: 1080x1920px (9:16)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-6">
              <h2 className="text-lg font-semibold">Paramètres</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Actif</FormLabel>
                        <FormDescription>Afficher cette bannière</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_on_desktop"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Afficher sur Desktop</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_on_mobile"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Afficher sur Mobile</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/banners')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
