import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedTable } from './EnhancedTable';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PromoCodeForm } from '../forms/PromoCodeForm';

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
  const [formOpen, setFormOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | undefined>();
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
      render: (value: any, promoCode: PromoCode) => (
        <div>
          <div className="font-medium">{promoCode.name}</div>
          <div className="text-sm text-muted-foreground font-mono">{promoCode.code}</div>
        </div>
      )
    },
    {
      key: 'discount',
      label: 'Remise',
      render: (value: any, promoCode: PromoCode) => (
        <span className="font-medium">
          {promoCode.discount_type === 'percentage' ? `${promoCode.discount_value}%` : `${promoCode.discount_value} MAD`}
        </span>
      )
    },
    {
      key: 'usage',
      label: 'Utilisation',
      render: (value: any, promoCode: PromoCode) => (
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
      render: (value: any, promoCode: PromoCode) => (
        <div className="text-sm">
          <div>Du {new Date(promoCode.valid_from).toLocaleDateString('fr-FR')}</div>
          <div>Au {new Date(promoCode.valid_until).toLocaleDateString('fr-FR')}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: any, promoCode: PromoCode) => getStatusBadge(promoCode)
    }
  ];

  const filteredPromoCodes = promoCodes.filter(promoCode =>
    promoCode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promoCode.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        valid_from: values.valid_from.toISOString(),
        valid_until: values.valid_until.toISOString(),
      };
      
      if (editingPromoCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(data)
          .eq('id', editingPromoCode.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Le code promo a été mis à jour",
        });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([{ ...data, used_count: 0 }]);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Le code promo a été créé",
        });
      }
      
      fetchPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setEditingPromoCode(undefined);
    }
  };

  const handleDelete = async (promoCode: PromoCode) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', promoCode.id);
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Le code promo a été supprimé",
      });
      
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <EnhancedTable
        title="Codes Promo"
        description="Gérer les codes de réduction"
        data={filteredPromoCodes}
        columns={columns}
        loading={loading}
        onRefresh={fetchPromoCodes}
        onAdd={() => setFormOpen(true)}
        onEdit={(code) => {
          setEditingPromoCode(code);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
        addButtonText="Nouveau code promo"
      />

      <PromoCodeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={editingPromoCode ? {
          ...editingPromoCode,
          valid_from: new Date(editingPromoCode.valid_from),
          valid_until: new Date(editingPromoCode.valid_until),
          discount_type: editingPromoCode.discount_type as 'fixed' | 'percentage'
        } : undefined}
      />
    </div>
  );
}