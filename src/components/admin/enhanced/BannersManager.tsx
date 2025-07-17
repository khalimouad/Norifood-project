import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  show_on_desktop: boolean;
  show_on_mobile: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
        title: "Erreur",
        description: "Impossible de charger les bannières",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (banner: Banner) => {
    if (!banner.is_active) {
      return <Badge variant="secondary">Inactif</Badge>;
    }
    
    const now = new Date();
    const startDate = new Date(banner.start_date);
    const endDate = new Date(banner.end_date);
    
    if (now < startDate) {
      return <Badge variant="outline">Programmé</Badge>;
    }
    
    if (now > endDate) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    
    return <Badge variant="default">Actif</Badge>;
  };

  const columns = [
    {
      key: 'image',
      label: 'Aperçu',
      render: (value: any, banner: Banner) => (
        <img 
          src={banner.image_url} 
          alt={banner.title}
          className="w-16 h-10 object-cover rounded"
        />
      )
    },
    {
      key: 'title',
      label: 'Titre',
      render: (value: any, banner: Banner) => (
        <div>
          <div className="font-medium">{banner.title}</div>
          {banner.subtitle && (
            <div className="text-sm text-muted-foreground">{banner.subtitle}</div>
          )}
        </div>
      )
    },
    {
      key: 'position',
      label: 'Position',
      render: (value: any, banner: Banner) => (
        <Badge variant="outline">{banner.position}</Badge>
      )
    },
    {
      key: 'visibility',
      label: 'Visibilité',
      render: (value: any, banner: Banner) => (
        <div className="flex gap-1">
          {banner.show_on_desktop && <Badge variant="outline" className="text-xs">Desktop</Badge>}
          {banner.show_on_mobile && <Badge variant="outline" className="text-xs">Mobile</Badge>}
        </div>
      )
    },
    {
      key: 'dates',
      label: 'Période',
      render: (value: any, banner: Banner) => (
        <div className="text-sm">
          <div>Du {new Date(banner.start_date).toLocaleDateString('fr-FR')}</div>
          <div>Au {new Date(banner.end_date).toLocaleDateString('fr-FR')}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: any, banner: Banner) => getStatusBadge(banner)
    }
  ];

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bannières</h2>
          <p className="text-muted-foreground">Gérer les bannières publicitaires</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle bannière
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <EnhancedTable
        title="Bannières"
        description="Gérer les bannières publicitaires"
        data={filteredBanners}
        columns={columns}
        loading={loading}
        onRefresh={fetchBanners}
        onAdd={() => console.log('Add banner')}
        addButtonText="Nouvelle bannière"
      />
    </div>
  );
}