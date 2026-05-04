import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EnhancedTable, StatusBadge } from './EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Star, Package } from 'lucide-react';
import { BulkImageUpdate } from '@/components/admin/BulkImageUpdate';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  unit_type: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  image_url?: string;
  created_at: string;
  categories?: { name: string };
}

export function EnhancedProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
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

  const handleEdit = (product: Product) => {
    navigate(`/admin/products/${product.id}`);
  };

  const handleView = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: `"${product.name}" a été supprimé avec succès`,
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    navigate('/admin/products/new');
  };

  const columns = [
    {
      key: 'image_url',
      label: 'Image',
      render: (value: string) => (
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt="Product" className="w-full h-full object-cover" />
          ) : (
            <Package className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Nom',
      sortable: true,
      render: (value: string, row: Product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {row.featured && (
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Vedette
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'categories',
      label: 'Catégorie',
      filterable: true,
      render: (value: any) => (
        <Badge variant="outline">
          {value?.name || 'Aucune'}
        </Badge>
      ),
    },
    {
      key: 'base_price',
      label: 'Prix',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{((value) ?? 0).toFixed(2)} MAD</span>
      ),
    },
    {
      key: 'unit_type',
      label: 'Unité',
      filterable: true,
      filterOptions: [
        { value: 'kg', label: 'Kilogramme' },
        { value: 'piece', label: 'Pièce' },
        { value: 'liter', label: 'Litre' },
        { value: 'gram', label: 'Gramme' },
      ],
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className={value < 5 ? 'text-red-600 font-medium' : 'text-foreground'}>
            {value}
          </span>
          {value < 5 && (
            <Badge variant="destructive" className="text-xs">
              Faible
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Statut',
      filterable: true,
      filterOptions: [
        { value: 'true', label: 'Actif' },
        { value: 'false', label: 'Inactif' },
      ],
      render: (value: boolean) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'created_at',
      label: 'Créé le',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <BulkImageUpdate />
      
      <EnhancedTable
        title="Gestion des produits"
        description="Gérez votre catalogue de produits"
        columns={columns}
        data={products}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onRefresh={fetchProducts}
        searchPlaceholder="Rechercher un produit..."
        addButtonText="Nouveau produit"
        emptyMessage="Aucun produit trouvé"
        exportFileName="produits"
      />
    </div>
  );
}