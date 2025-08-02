import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Save, ArrowLeft, Plus, Trash2, Tag } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  unit_type: string;
  stock_quantity: number;
  min_order_quantity: number;
  max_order_quantity?: number;
  category_id?: string;
  is_active: boolean;
  featured: boolean;
  has_variations: boolean;
  image_url?: string;
  images: string[];
  keywords: string[];
  origin?: string;
  product_type?: string;
  shelf_life?: string;
  storage_conditions?: string;
  preparation_tips?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [variations, setVariations] = useState<any[]>([]);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      is_active: true,
      featured: false,
      has_variations: false,
      base_price: 0,
      stock_quantity: 0,
      min_order_quantity: 1,
      unit_type: 'kg',
      images: [],
      keywords: []
    }
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEditing) {
      fetchProduct();
    }
  }, [isEditing, id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').eq('is_active', true);
    setCategories(data || []);
  };

  const fetchTags = async () => {
    const { data } = await supabase.from('tags').select('*').eq('is_active', true);
    setTags(data || []);
  };

  const fetchProduct = async () => {
    try {
      // First get the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      // Then get the product tags separately
      const { data: productTags, error: tagsError } = await supabase
        .from('product_tags')
        .select('tag_id')
        .eq('product_id', id);

      if (tagsError) {
        console.error('Error fetching product tags:', tagsError);
      }

      // Get product variations
      const { data: productVariations, error: variationsError } = await supabase
        .from('product_variations')
        .select('*')
        .eq('product_id', id);

      if (variationsError) {
        console.error('Error fetching product variations:', variationsError);
      }

      if (product) {
        reset({
          ...product,
          has_variations: (productVariations?.length || 0) > 0,
          images: product.images || []
        });
        setSelectedTags(productTags?.map((pt) => pt.tag_id) || []);
        setVariations(productVariations || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      });
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return watch('images') || [];

    const uploadedUrls: string[] = [];
    
    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return [...(watch('images') || []), ...uploadedUrls];
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      // Upload images
      const imageUrls = await uploadImages();
      const productData = {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        images: imageUrls,
        image_url: imageUrls[0] || data.image_url
      };

      let productId = id;

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        productId = newProduct.id;
      }

      // Update product tags
      if (productId) {
        // Remove existing tags
        await supabase.from('product_tags').delete().eq('product_id', productId);
        
        // Add new tags
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            product_id: productId,
            tag_id: tagId
          }));
          
          await supabase.from('product_tags').insert(tagInserts);
        }

        // Handle variations
        if (data.has_variations && variations.length > 0) {
          // Remove existing variations
          await supabase.from('product_variations').delete().eq('product_id', productId);
          
          // Add new variations
          const variationInserts = variations.map(variation => ({
            product_id: productId,
            name: variation.name,
            price: variation.price,
            weight_kg: variation.weight_kg,
            stock_quantity: variation.stock_quantity,
            is_active: variation.is_active
          }));
          
          await supabase.from('product_variations').insert(variationInserts);
        } else if (!data.has_variations) {
          // Remove all variations if has_variations is disabled
          await supabase.from('product_variations').delete().eq('product_id', productId);
        }
      }

      toast({
        title: "Succès",
        description: `Produit ${isEditing ? 'modifié' : 'créé'} avec succès`,
      });

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditing ? 'modifier' : 'créer'} le produit`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    const currentImages = watch('images') || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue('images', newImages);
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = watch('keywords') || [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        setValue('keywords', [...currentKeywords, keywordInput.trim()]);
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = watch('keywords') || [];
    setValue('keywords', currentKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>Détails de base du produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Le nom est requis' })}
                      placeholder="Ex: Saumon frais"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_id">Catégorie</Label>
                    <Select onValueChange={(value) => setValue('category_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
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
                    {...register('description')}
                    placeholder="Description détaillée du produit"
                    rows={3}
                  />
                </div>

                {/* Keywords Section */}
                <div className="space-y-2">
                  <Label>Mots-clés pour la recherche</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un mot-clé..."
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={handleKeywordKeyPress}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addKeyword}
                        disabled={!keywordInput.trim()}
                      >
                        <Tag className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    {watch('keywords')?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {watch('keywords')?.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Ajoutez des mots-clés qui aideront les clients à trouver ce produit lors de leurs recherches
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Prix de base (MAD) *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      {...register('base_price', { 
                        required: 'Le prix est requis',
                        min: { value: 0, message: 'Le prix doit être positif' }
                      })}
                    />
                    {errors.base_price && (
                      <p className="text-sm text-red-600">{errors.base_price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit_type">Unité *</Label>
                    <Select onValueChange={(value) => setValue('unit_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogramme</SelectItem>
                        <SelectItem value="piece">Pièce</SelectItem>
                        <SelectItem value="liter">Litre</SelectItem>
                        <SelectItem value="gram">Gramme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      {...register('stock_quantity', { min: 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_order_quantity">Quantité min. commande</Label>
                    <Input
                      id="min_order_quantity"
                      type="number"
                      {...register('min_order_quantity', { min: 1 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_order_quantity">Quantité max. commande</Label>
                    <Input
                      id="max_order_quantity"
                      type="number"
                      {...register('max_order_quantity')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations supplémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origine</Label>
                    <Input
                      id="origin"
                      {...register('origin')}
                      placeholder="Ex: Océan Atlantique"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product_type">Type de produit</Label>
                    <Input
                      id="product_type"
                      {...register('product_type')}
                      placeholder="Ex: Poisson frais"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shelf_life">Durée de conservation</Label>
                    <Input
                      id="shelf_life"
                      {...register('shelf_life')}
                      placeholder="Ex: 3 jours au frais"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage_conditions">Conditions de stockage</Label>
                    <Input
                      id="storage_conditions"
                      {...register('storage_conditions')}
                      placeholder="Ex: 0-4°C"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation_tips">Conseils de préparation</Label>
                  <Textarea
                    id="preparation_tips"
                    {...register('preparation_tips')}
                    placeholder="Conseils pour la préparation du produit"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Étiquettes</CardTitle>
                <CardDescription>Ajoutez des étiquettes pour catégoriser le produit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        style={isSelected ? { backgroundColor: tag.color } : {}}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Variations Management - Only show when has_variations is enabled */}
            {watch('has_variations') && (
              <Card>
                <CardHeader>
                  <CardTitle>Variantes du produit</CardTitle>
                  <CardDescription>Gérez les différentes variantes de ce produit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Variantes</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVariations([...variations, { 
                        name: '', 
                        price: watch('base_price') || 0, 
                        weight_kg: 1, 
                        stock_quantity: 0,
                        is_active: true 
                      }])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une variante
                    </Button>
                  </div>

                  {/* Quick Add Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const basePrice = watch('base_price') || 0;
                        const newVariations = [
                          { name: '250g', weight_kg: 0.25, price: basePrice * 0.25, stock_quantity: 0, is_active: true },
                          { name: '500g', weight_kg: 0.5, price: basePrice * 0.5, stock_quantity: 0, is_active: true },
                          { name: '1kg', weight_kg: 1, price: basePrice, stock_quantity: 0, is_active: true },
                          { name: '2kg', weight_kg: 2, price: basePrice * 2, stock_quantity: 0, is_active: true }
                        ];
                        setVariations(newVariations);
                      }}
                    >
                      Variantes de poids
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const basePrice = watch('base_price') || 0;
                        const newVariations = [
                          { name: '1 pièce', weight_kg: 1, price: basePrice, stock_quantity: 0, is_active: true },
                          { name: '3 pièces', weight_kg: 3, price: basePrice * 2.8, stock_quantity: 0, is_active: true },
                          { name: '5 pièces', weight_kg: 5, price: basePrice * 4.5, stock_quantity: 0, is_active: true },
                          { name: '10 pièces', weight_kg: 10, price: basePrice * 8.5, stock_quantity: 0, is_active: true }
                        ];
                        setVariations(newVariations);
                      }}
                    >
                      Variantes par pièces
                    </Button>
                  </div>

                  {/* Variations List */}
                  <div className="space-y-3">
                    {variations.map((variation, index) => (
                      <div key={index} className="border rounded p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Variante {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setVariations(variations.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Nom</Label>
                            <Input
                              value={variation.name}
                              onChange={(e) => {
                                const newVariations = [...variations];
                                newVariations[index].name = e.target.value;
                                setVariations(newVariations);
                              }}
                              placeholder="Ex: 500g"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Poids (kg)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variation.weight_kg}
                              onChange={(e) => {
                                const newVariations = [...variations];
                                newVariations[index].weight_kg = parseFloat(e.target.value) || 0;
                                setVariations(newVariations);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Prix (MAD)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variation.price}
                              onChange={(e) => {
                                const newVariations = [...variations];
                                newVariations[index].price = parseFloat(e.target.value) || 0;
                                setVariations(newVariations);
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Stock</Label>
                            <Input
                              type="number"
                              value={variation.stock_quantity}
                              onChange={(e) => {
                                const newVariations = [...variations];
                                newVariations[index].stock_quantity = parseInt(e.target.value) || 0;
                                setVariations(newVariations);
                              }}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {variations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucune variante ajoutée. Utilisez les boutons ci-dessus pour ajouter des variantes.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Produit actif</Label>
                  <Switch
                    id="is_active"
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Produit vedette</Label>
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="has_variations">Produit avec variantes</Label>
                  <Switch
                    id="has_variations"
                    checked={watch('has_variations')}
                    onCheckedChange={(checked) => setValue('has_variations', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Ajoutez des images du produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Télécharger des images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Existing Images */}
                {watch('images')?.length > 0 && (
                  <div className="space-y-2">
                    <Label>Images actuelles</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {watch('images')?.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Nouvelles images à ajouter</Label>
                    <div className="text-sm text-muted-foreground">
                      {imageFiles.map(file => file.name).join(', ')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
