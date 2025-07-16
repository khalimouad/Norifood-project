import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  name: string;
  description: string;
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

export const PromoCodesAdmin = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
    minimum_order_amount: 0,
    usage_limit: 0,
    is_active: true,
    valid_from: "",
    valid_until: "",
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-promo-codes');
      if (error) throw error;
      setPromoCodes(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingCode ? `manage-promo-codes?id=${editingCode.id}` : 'manage-promo-codes';
      
      const { error } = await supabase.functions.invoke(endpoint, {
        body: formData,
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: editingCode ? "Code promo modifié" : "Code promo créé",
      });
      
      setIsDialogOpen(false);
      setEditingCode(null);
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le code promo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return;
    
    try {
      const { error } = await supabase.functions.invoke(`manage-promo-codes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Code promo supprimé",
      });
      
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le code promo",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      minimum_order_amount: 0,
      usage_limit: 0,
      is_active: true,
      valid_from: "",
      valid_until: "",
    });
  };

  const openEditDialog = (promoCode: PromoCode) => {
    setEditingCode(promoCode);
    setFormData({
      code: promoCode.code,
      name: promoCode.name,
      description: promoCode.description || "",
      discount_type: promoCode.discount_type,
      discount_value: promoCode.discount_value,
      minimum_order_amount: promoCode.minimum_order_amount || 0,
      usage_limit: promoCode.usage_limit || 0,
      is_active: promoCode.is_active,
      valid_from: promoCode.valid_from ? new Date(promoCode.valid_from).toISOString().split('T')[0] : "",
      valid_until: promoCode.valid_until ? new Date(promoCode.valid_until).toISOString().split('T')[0] : "",
    });
    setIsDialogOpen(true);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Codes Promo ({promoCodes.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingCode(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un code promo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "Modifier le code promo" : "Ajouter un code promo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">Type de réduction</Label>
                  <Select 
                    value={formData.discount_type} 
                    onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                  >
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
                  <Label htmlFor="discount_value">
                    Valeur {formData.discount_type === 'percentage' ? '(%)' : '(DH)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimum_order_amount">Montant minimum (DH)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({ ...formData, minimum_order_amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="usage_limit">Limite d'utilisation</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valide à partir de</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valide jusqu'à</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
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
                  {editingCode ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {promoCodes.map((promoCode) => (
          <Card key={promoCode.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{promoCode.code}</h3>
                    <span className="text-sm text-muted-foreground">- {promoCode.name}</span>
                    {!promoCode.is_active && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{promoCode.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>Réduction: {promoCode.discount_value}{promoCode.discount_type === 'percentage' ? '%' : ' DH'}</p>
                      <p>Montant minimum: {promoCode.minimum_order_amount} DH</p>
                    </div>
                    <div>
                      <p>Utilisations: {promoCode.used_count}/{promoCode.usage_limit || '∞'}</p>
                      <p>Valide jusqu'à: {promoCode.valid_until ? new Date(promoCode.valid_until).toLocaleDateString() : 'Illimité'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(promoCode)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(promoCode.id)}
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