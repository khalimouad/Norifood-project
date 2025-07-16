import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface ProductVariation {
  id?: string;
  name: string;
  price: number;
  weight_kg: number;
  stock_quantity: number;
  is_active: boolean;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  base_price: number;
  unit_type: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  slug: string;
  image_url: string;
  product_type?: string;
  origin?: string;
  storage_conditions?: string;
  shelf_life?: string;
  preparation_tips?: string;
  variations?: ProductVariation[];
}

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    unit_type: 'kg',
    stock_quantity: 0,
    is_active: true,
    featured: false,
    image_url: '',
    image: '',
    product_type: 'Poisson Frais',
    origin: 'Atlantique Nord',
    storage_conditions: '0-4°C',
    shelf_life: '2-3 jours',
    preparation_tips: '',
    category_id: '',
  });

  const [variationForm, setVariationForm] = useState({
    name: '',
    price: 0,
    weight_kg: 0,
    stock_quantity: 1,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-categories');
      if (error) throw error;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('manage-products', {
        body: { id }
      });
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          base_price: data.base_price || 0,
          unit_type: data.unit_type || 'kg',
          stock_quantity: data.stock_quantity || 0,
          is_active: data.is_active ?? true,
          featured: data.featured ?? false,
          image_url: data.image_url || '',
          image: '',
          product_type: data.product_type || 'Poisson Frais',
          origin: data.origin || 'Atlantique Nord',
          storage_conditions: data.storage_conditions || '0-4°C',
          shelf_life: data.shelf_life || '2-3 jours',
          preparation_tips: data.preparation_tips || '',
          category_id: data.category_id || '',
        });
        setVariations(data.product_variations || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const functionName = 'manage-products';
      const payload = {
        ...formData,
        variations: variations,
        method: id ? 'PUT' : 'POST',
        id: id || undefined,
      };

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: id ? "Produit modifié avec succès" : "Produit créé avec succès",
      });
      navigate('/admin');
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

  const handleAddVariation = () => {
    if (editingVariation) {
      setVariations(variations.map(v => 
        v.id === editingVariation.id ? { ...variationForm, id: editingVariation.id } : v
      ));
      setEditingVariation(null);
    } else {
      setVariations([...variations, { ...variationForm, id: Date.now().toString() }]);
    }
    setVariationForm({ name: '', price: 0, weight_kg: 0, stock_quantity: 1, is_active: true });
  };

  const handleEditVariation = (variation: ProductVariation) => {
    setVariationForm({
      name: variation.name,
      price: variation.price,
      weight_kg: variation.weight_kg,
      stock_quantity: variation.stock_quantity,
      is_active: variation.is_active,
    });
    setEditingVariation(variation);
  };

  const handleDeleteVariation = (variationId: string) => {
    setVariations(variations.filter(v => v.id !== variationId));
  };

  const productTypeOptions = [
    'Poisson Frais',
    'Poisson Surgelé',
    'Fruits de Mer',
    'Crustacés',
    'Mollusques',
    'Poisson Fumé',
    'Conserves'
  ];

  const originOptions = [
    'Atlantique Nord',
    'Méditerranée',
    'Océan Indien',
    'Pacifique',
    'Atlantique Sud',
    'Mer du Nord',
    'Local'
  ];

  const storageOptions = [
    '0-4°C',
    '-18°C',
    'Température ambiante',
    '2-8°C',
    'Réfrigéré'
  ];

  const shelfLifeOptions = [
    '1-2 jours',
    '2-3 jours',
    '3-5 jours',
    '1 semaine',
    '2 semaines',
    '1 mois',
    '6 mois',
    '1 an'
  ];

  if (loading && id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {id ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du Produit</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base_price">Prix de Base (MAD)</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit_type">Type d'Unité</Label>
                    <Select value={formData.unit_type} onValueChange={(value) => setFormData({ ...formData, unit_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramme</SelectItem>
                        <SelectItem value="piece">Pièce</SelectItem>
                        <SelectItem value="g">Gramme</SelectItem>
                        <SelectItem value="l">Litre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock_quantity">Quantité en Stock</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  />
                </div>

                <div>
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

                <div className="flex items-center space-x-4">
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
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Mis en Avant</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du Produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product_type">Type de Produit</Label>
                  <Select value={formData.product_type} onValueChange={(value) => setFormData({ ...formData, product_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origin">Origine</Label>
                  <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {originOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="storage_conditions">Conditions de Conservation</Label>
                  <Select value={formData.storage_conditions} onValueChange={(value) => setFormData({ ...formData, storage_conditions: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {storageOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="shelf_life">Durée de Conservation</Label>
                  <Select value={formData.shelf_life} onValueChange={(value) => setFormData({ ...formData, shelf_life: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shelfLifeOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preparation_tips">Conseils de Préparation</Label>
                  <Textarea
                    id="preparation_tips"
                    value={formData.preparation_tips}
                    onChange={(e) => setFormData({ ...formData, preparation_tips: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Image du Produit</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageSelect={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image_url}
              />
            </CardContent>
          </Card>

          {/* Product Variations */}
          <Card>
            <CardHeader>
              <CardTitle>Variations de Produit (Pièces Individuelles)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add/Edit Variation Form */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded">
                  <div>
                    <Label htmlFor="variation_name">Nom de la Pièce</Label>
                    <Input
                      id="variation_name"
                      placeholder="Ex: Filet de Saumon #1"
                      value={variationForm.name}
                      onChange={(e) => setVariationForm({ ...variationForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variation_price">Prix (MAD)</Label>
                    <Input
                      id="variation_price"
                      type="number"
                      step="0.01"
                      value={variationForm.price}
                      onChange={(e) => setVariationForm({ ...variationForm, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variation_weight">Poids (kg)</Label>
                    <Input
                      id="variation_weight"
                      type="number"
                      step="0.01"
                      value={variationForm.weight_kg}
                      onChange={(e) => setVariationForm({ ...variationForm, weight_kg: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="variation_stock">Stock</Label>
                    <Input
                      id="variation_stock"
                      type="number"
                      value={variationForm.stock_quantity}
                      onChange={(e) => setVariationForm({ ...variationForm, stock_quantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleAddVariation}
                      className="w-full"
                    >
                      {editingVariation ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      {editingVariation ? 'Modifier' : 'Ajouter'}
                    </Button>
                  </div>
                </div>

                {/* Variations List */}
                {variations.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Poids</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variations.map((variation) => (
                        <TableRow key={variation.id}>
                          <TableCell>{variation.name}</TableCell>
                          <TableCell>{variation.price} MAD</TableCell>
                          <TableCell>{variation.weight_kg} kg</TableCell>
                          <TableCell>{variation.stock_quantity}</TableCell>
                          <TableCell>
                            <Badge variant={variation.is_active ? "default" : "secondary"}>
                              {variation.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditVariation(variation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteVariation(variation.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Enregistrement...' : 'Enregistrer le Produit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;