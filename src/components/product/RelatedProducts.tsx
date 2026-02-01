import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string | null;
}

export const RelatedProducts = ({ currentProductId, categoryId }: RelatedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  const fetchRelatedProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", currentProductId)
        .limit(4);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If not enough products in same category, fetch more
      if (data && data.length < 4) {
        const { data: moreProducts } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .neq("id", currentProductId)
          .not("id", "in", `(${data.map(p => p.id).join(",")})`)
          .limit(4 - data.length);

        setProducts([...data, ...(moreProducts || [])]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.base_price,
      image: product.image_url || "/placeholder.svg",
      unitType: product.unit_type,
    });
    toast({
      title: "Produit ajouté !",
      description: `${product.name} ajouté au panier`,
    });
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">Produits Similaires</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <Link to={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <CardContent className="p-3">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-medium text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-primary">
                  {product.base_price} DH
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
