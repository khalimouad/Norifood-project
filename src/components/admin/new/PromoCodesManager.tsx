import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Percent, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type PromoCode = Tables<'promo_codes'>;

export function PromoCodesManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    minimum_order_amount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true
  });

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
        title: 'Erreur',
        description: 'Impossible de charger les codes promo',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const promoCodeData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value) || 0,
        minimum_order_amount: formData.minimum_order_amount ? parseFloat(formData.minimum_order_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null
      };

      if (selectedPromoCode) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoCodeData)
          .eq('id', selectedPromoCode.id);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Code promo modifié avec succès'
        });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert([promoCodeData]);

        if (error) throw error;
        toast({
          title: 'Succès',
          description: 'Code promo créé avec succès'
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le code promo',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setFormData({
      name: promoCode.name,
      code: promoCode.code,
      description: promoCode.description || '',
      discount_type: promoCode.discount_type,
      discount_value: promoCode.discount_value.toString(),
      minimum_order_amount: promoCode.minimum_order_amount?.toString() || '',
      usage_limit: promoCode.usage_limit?.toString() || '',
      valid_from: promoCode.valid_from || '',
      valid_until: promoCode.valid_until || '',
      is_active: promoCode.is_active || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Succès',
        description: 'Code promo supprimé avec succès'
      });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le code promo',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
      is_active: true
    });
    setSelectedPromoCode(null);
  };

  const handleNewPromoCode = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const formatDiscount = (value: number, type: string) => {
    if (type === 'percentage') {
      return `${value}%`;
    }
    return `${value} MAD`;
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Codes Promo</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPromoCode}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau code promo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPromoCode ? 'Modifier le code promo' : 'Nouveau code promo'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom du code promo"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="PROMO2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du code promo"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">Type de réduction</Label>
                  <Select value={formData.discount_type} onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant fixe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_value">Valeur de réduction</Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                    placeholder={formData.discount_type === 'percentage' ? '10' : '50'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimum_order_amount">Montant minimum (MAD)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_order_amount: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="usage_limit">Limite d'utilisation</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valide à partir de</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valide jusqu'à</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                  />
                </div>
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
                  {selectedPromoCode ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promoCodes.map((promoCode) => (
          <Card key={promoCode.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  {promoCode.name}
                  <Badge variant={promoCode.is_active ? "default" : "secondary"}>
                    {promoCode.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                  {isExpired(promoCode.valid_until) && (
                    <Badge variant="destructive">Expiré</Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(promoCode)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(promoCode.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Code:</strong> {promoCode.code}
                </div>
                <div>
                  <strong>Réduction:</strong> {formatDiscount(promoCode.discount_value, promoCode.discount_type)}
                </div>
                <div>
                  <strong>Montant minimum:</strong> {promoCode.minimum_order_amount ? `${promoCode.minimum_order_amount} MAD` : 'Aucun'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <strong>Utilisé:</strong> {promoCode.used_count || 0} / {promoCode.usage_limit || '∞'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <strong>Valide du:</strong> {promoCode.valid_from ? new Date(promoCode.valid_from).toLocaleDateString() : 'Non défini'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <strong>Valide jusqu'au:</strong> {promoCode.valid_until ? new Date(promoCode.valid_until).toLocaleDateString() : 'Non défini'}
                </div>
              </div>
              {promoCode.description && (
                <p className="mt-2 text-sm text-muted-foreground">{promoCode.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}