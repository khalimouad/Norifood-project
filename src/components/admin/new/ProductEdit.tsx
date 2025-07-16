import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from './ProductForm';

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

export function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      });
      navigate('/admin-new');
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = () => {
    navigate('/admin-new');
  };

  const handleCancel = () => {
    navigate('/admin-new');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {id === 'new' ? 'Nouveau produit' : 'Modifier le produit'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {id === 'new' ? 'Créer un nouveau produit' : `Modifier: ${product?.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              product={product}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}