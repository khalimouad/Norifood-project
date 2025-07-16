import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  unit_type: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  image_url: string;
  product_type?: string;
  origin?: string;
  storage_conditions?: string;
  shelf_life?: string;
  preparation_tips?: string;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSaved, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    unit_type: 'kg',
    stock_quantity: 0,
    is_active: true,
    featured: false,
    image_url: '',
    product_type: 'Poisson Frais',
    origin: 'Atlantique Nord',
    storage_conditions: '0-4°C',
    shelf_life: '2-3 jours',
    preparation_tips: '',
    category_id: '',
  });

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        base_price: product.base_price || 0,
        unit_type: product.unit_type || 'kg',
        stock_quantity: product.stock_quantity || 0,
        is_active: product.is_active ?? true,
        featured: product.featured ?? false,
        image_url: product.image_url || '',
        product_type: product.product_type || 'Poisson Frais',
        origin: product.origin || 'Atlantique Nord',
        storage_conditions: product.storage_conditions || '0-4°C',
        shelf_life: product.shelf_life || '2-3 jours',
        preparation_tips: product.preparation_tips || '',
        category_id: product.category_id || '',
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category_id: formData.category_id || null,
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Produit modifié avec succès",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Produit créé avec succès",
        });
      }

      onSaved();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base_price">Prix de base</Label>
          <Input
            id="base_price"
            type="number"
            step="0.01"
            value={formData.base_price}
            onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_type">Unité</Label>
          <Select value={formData.unit_type} onValueChange={(value) => setFormData({ ...formData, unit_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="pièce">pièce</SelectItem>
              <SelectItem value="l">l</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://exemple.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product_type">Type de produit</Label>
          <Select value={formData.product_type} onValueChange={(value) => setFormData({ ...formData, product_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Poisson Frais">Poisson Frais</SelectItem>
              <SelectItem value="Fruits de Mer">Fruits de Mer</SelectItem>
              <SelectItem value="Poisson Congelé">Poisson Congelé</SelectItem>
              <SelectItem value="Conserves">Conserves</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Origine</Label>
          <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Atlantique Nord">Atlantique Nord</SelectItem>
              <SelectItem value="Méditerranée">Méditerranée</SelectItem>
              <SelectItem value="Océan Indien">Océan Indien</SelectItem>
              <SelectItem value="Local">Local</SelectItem>
              <SelectItem value="Élevage">Élevage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storage_conditions">Conditions de stockage</Label>
          <Select value={formData.storage_conditions} onValueChange={(value) => setFormData({ ...formData, storage_conditions: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-4°C">0-4°C</SelectItem>
              <SelectItem value="-18°C">-18°C</SelectItem>
              <SelectItem value="Température ambiante">Température ambiante</SelectItem>
              <SelectItem value="Frais et sec">Frais et sec</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shelf_life">Durée de conservation</Label>
          <Select value={formData.shelf_life} onValueChange={(value) => setFormData({ ...formData, shelf_life: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2 jours">1-2 jours</SelectItem>
              <SelectItem value="2-3 jours">2-3 jours</SelectItem>
              <SelectItem value="3-5 jours">3-5 jours</SelectItem>
              <SelectItem value="1 semaine">1 semaine</SelectItem>
              <SelectItem value="1 mois">1 mois</SelectItem>
              <SelectItem value="3 mois">3 mois</SelectItem>
              <SelectItem value="6 mois">6 mois</SelectItem>
              <SelectItem value="1 an">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparation_tips">Conseils de préparation</Label>
        <Textarea
          id="preparation_tips"
          value={formData.preparation_tips}
          onChange={(e) => setFormData({ ...formData, preparation_tips: e.target.value })}
          rows={3}
          placeholder="Conseils pour la préparation, cuisson, assaisonnement..."
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Produit actif</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Produit mis en avant</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sauvegarde...' : (product ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}