import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PromoCode {
  id: string;
  name: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

export function PromoCodesManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (promoCode: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(promoCode.valid_from);
    const validUntil = new Date(promoCode.valid_until);
    
    if (!promoCode.is_active) {
      return <Badge variant="secondary">Inactif</Badge>;
    }
    
    if (now < validFrom) {
      return <Badge variant="outline">Pas encore actif</Badge>;
    }
    
    if (now > validUntil) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    
    if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
      return <Badge variant="destructive">Épuisé</Badge>;
    }
    
    return <Badge variant="default">Actif</Badge>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      render: (promoCode: PromoCode) => (
        <div>
          <div className="font-medium">{promoCode.name}</div>
          <div className="text-sm text-muted-foreground font-mono">{promoCode.code}</div>
        </div>
      )
    },
    {
      key: 'discount',
      label: 'Remise',
      render: (promoCode: PromoCode) => (
        <span className="font-medium">
          {promoCode.discount_type === 'percentage' ? `${promoCode.discount_value}%` : `${promoCode.discount_value} MAD`}
        </span>
      )
    },
    {
      key: 'usage',
      label: 'Utilisation',
      render: (promoCode: PromoCode) => (
        <div className="text-sm">
          <div>{promoCode.used_count} utilisé(s)</div>
          {promoCode.usage_limit && (
            <div className="text-muted-foreground">sur {promoCode.usage_limit} max</div>
          )}
        </div>
      )
    },
    {
      key: 'validity',
      label: 'Validité',
      render: (promoCode: PromoCode) => (
        <div className="text-sm">
          <div>Du {new Date(promoCode.valid_from).toLocaleDateString('fr-FR')}</div>
          <div>Au {new Date(promoCode.valid_until).toLocaleDateString('fr-FR')}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (promoCode: PromoCode) => getStatusBadge(promoCode)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (promoCode: PromoCode) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredPromoCodes = promoCodes.filter(promoCode =>
    promoCode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promoCode.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Codes Promo</h2>
          <p className="text-muted-foreground">Gérer les codes de réduction</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau code promo
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou code..."
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
        title="Codes Promo"
        description="Gérer les codes de réduction"
        data={filteredPromoCodes}
        columns={columns}
        loading={loading}
        onRefresh={fetchPromoCodes}
      />
    </div>
  );
}