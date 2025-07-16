import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Search, Grid, List, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from './ImageUpload';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  unit_type: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  slug: string;
  image_url: string;
  created_at: string;
  product_type?: string;
  origin?: string;
  storage_conditions?: string;
  shelf_life?: string;
  preparation_tips?: string;
}

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    unit_type: '',
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
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product =>
        statusFilter === 'active' ? product.is_active : !product.is_active
      );
    }

    if (featuredFilter !== 'all') {
      filtered = filtered.filter(product =>
        featuredFilter === 'featured' ? product.featured : !product.featured
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter, featuredFilter]);

  const fetchProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`https://fxqeczayzxuvewncpaod.supabase.co/functions/v1/manage-products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cWVjemF5enh1dmV3bmNwYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM0NjUsImV4cCI6MjA2ODE4OTQ2NX0.j_n5rgp75XkDVkl617685i_g4CcVkAv5OyLC7qdtkR8',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle paginated response
      const productsData = data?.products || data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `https://fxqeczayzxuvewncpaod.supabase.co/functions/v1/manage-products?id=${editingProduct.id}`
        : 'https://fxqeczayzxuvewncpaod.supabase.co/functions/v1/manage-products';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cWVjemF5enh1dmV3bmNwYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM0NjUsImV4cCI6MjA2ODE4OTQ2NX0.j_n5rgp75XkDVkl617685i_g4CcVkAv5OyLC7qdtkR8',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast({
        title: "Succès",
        description: editingProduct ? "Produit modifié" : "Produit créé",
      });
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`https://fxqeczayzxuvewncpaod.supabase.co/functions/v1/manage-products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cWVjemF5enh1dmV3bmNwYW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM0NjUsImV4cCI6MjA2ODE4OTQ2NX0.j_n5rgp75XkDVkl617685i_g4CcVkAv5OyLC7qdtkR8',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast({
        title: "Succès",
        description: "Produit supprimé",
      });
      
      fetchProducts();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      base_price: 0,
      unit_type: '',
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
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      base_price: product.base_price,
      unit_type: product.unit_type,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      featured: product.featured,
      image_url: product.image_url || '',
      image: '',
      product_type: product.product_type || 'Poisson Frais',
      origin: product.origin || 'Atlantique Nord',
      storage_conditions: product.storage_conditions || '0-4°C',
      shelf_life: product.shelf_life || '2-3 jours',
      preparation_tips: product.preparation_tips || '',
    });
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleImageSelect = (imageData: string) => {
    setFormData({ ...formData, image: imageData, image_url: imageData });
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Produits ({filteredProducts.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingProduct(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Le slug sera généré automatiquement à partir du nom
                </p>
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
                <div>
                  <Label htmlFor="unit_type">Unité</Label>
                  <Input
                    id="unit_type"
                    value={formData.unit_type}
                    onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <ImageUpload 
                  onImageSelect={handleImageSelect}
                  currentImage={formData.image_url}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Détails du Produit</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_type">Type</Label>
                    <Select 
                      value={formData.product_type} 
                      onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Poisson Frais">Poisson Frais</SelectItem>
                        <SelectItem value="Fruits de Mer">Fruits de Mer</SelectItem>
                        <SelectItem value="Poisson Congelé">Poisson Congelé</SelectItem>
                        <SelectItem value="Conserves">Conserves</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="origin">Origine</Label>
                    <Select 
                      value={formData.origin} 
                      onValueChange={(value) => setFormData({ ...formData, origin: value })}
                    >
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
                  
                  <div>
                    <Label htmlFor="storage_conditions">Conservation</Label>
                    <Select 
                      value={formData.storage_conditions} 
                      onValueChange={(value) => setFormData({ ...formData, storage_conditions: value })}
                    >
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
                  
                  <div>
                    <Label htmlFor="shelf_life">Durée de conservation</Label>
                    <Select 
                      value={formData.shelf_life} 
                      onValueChange={(value) => setFormData({ ...formData, shelf_life: value })}
                    >
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
                
                <div>
                  <Label htmlFor="preparation_tips">Conseils de Préparation</Label>
                  <Textarea
                    id="preparation_tips"
                    value={formData.preparation_tips}
                    onChange={(e) => setFormData({ ...formData, preparation_tips: e.target.value })}
                    placeholder="Conseils pour la préparation, cuisson, assaisonnement..."
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
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Mis en avant</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingProduct ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={featuredFilter} onValueChange={(value: any) => setFeaturedFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="featured">Mis en avant</SelectItem>
              <SelectItem value="not-featured">Non mis en avant</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Data Display */}
      {viewMode === 'table' ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No img</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.product_type || 'Non défini'}</Badge>
                  </TableCell>
                  <TableCell>{product.base_price} DH/{product.unit_type}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock_quantity > 0 ? 'secondary' : 'destructive'}>
                      {product.stock_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={product.is_active ? 'secondary' : 'destructive'}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      {product.featured && <Badge>Vedette</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.featured && (
                        <Badge className="bg-primary text-primary-foreground">
                          Vedette
                        </Badge>
                      )}
                      <Badge variant={product.is_active ? 'secondary' : 'destructive'}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex gap-4 text-sm mb-2">
                      <span>Prix: {product.base_price} DH/{product.unit_type}</span>
                      <span>Stock: {product.stock_quantity}</span>
                    </div>
                    {(product.product_type || product.origin || product.storage_conditions || product.shelf_life) && (
                      <div className="border-t pt-2 mt-2">
                        <h4 className="font-medium text-sm mb-1">Détails du Produit</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {product.product_type && <div><span className="font-medium">Type:</span> {product.product_type}</div>}
                          {product.origin && <div><span className="font-medium">Origine:</span> {product.origin}</div>}
                          {product.storage_conditions && <div><span className="font-medium">Conservation:</span> {product.storage_conditions}</div>}
                          {product.shelf_life && <div><span className="font-medium">Durée:</span> {product.shelf_life}</div>}
                        </div>
                        {product.preparation_tips && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">Conseils:</span> {product.preparation_tips}
                          </div>
                        )}
                      </div>
                    )}
                    {product.image_url && (
                      <div className="mt-2">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};