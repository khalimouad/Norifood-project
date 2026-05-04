import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Product components
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductVariations } from "@/components/product/ProductVariations";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";

type Product = Tables<"products">;
type ProductVariation = Tables<"product_variations">;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({
          title: "Produit introuvable",
          description: "Ce produit n'existe pas ou n'est plus disponible",
          variant: "destructive"
        });
        return;
      }
      
      setProduct(data);
      
      // Fetch variations
      const { data: variationsData, error: variationsError } = await supabase
        .from("product_variations")
        .select("*")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (variationsError) throw variationsError;
      setVariations(variationsData || []);
      
      // Auto-select first variation if available
      if (variationsData && variationsData.length > 0) {
        setSelectedVariation(variationsData[0]);
      }
      
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const finalPrice = selectedVariation ? selectedVariation.price : product.base_price;
    const finalWeight = selectedVariation ? selectedVariation.weight_kg : null;
    const itemId = selectedVariation ? `${product.id}-${selectedVariation.id}` : product.id;
    const itemName = selectedVariation ? `${product.name} - ${selectedVariation.name}` : product.name;
    
    addItem({
      id: itemId,
      name: itemName,
      price: finalPrice,
      image: product.image_url || "/placeholder.svg",
      unitType: product.unit_type as string,
      variationId: selectedVariation?.id,
      weight: finalWeight || undefined
    });

    toast({
      title: "Produit ajouté !",
      description: `${quantity} ${selectedVariation ? `pièce de ${finalWeight}kg` : product.unit_type} de ${itemName} ajouté(s) au panier`
    });
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <ProductDetailSkeleton />
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
          <Link to="/products">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  // Properly handle empty images array
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image_url || "/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Produits</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <ProductImageGallery
              images={images}
              productName={product.name}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />

            {/* Product Info */}
            <div className="space-y-6">
              <ProductInfo product={product} selectedVariation={selectedVariation} />

              {product.description && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Product Variations */}
              <ProductVariations
                variations={variations}
                selectedVariation={selectedVariation}
                onSelectVariation={setSelectedVariation}
              />

              {/* Quantity + CTA */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantité
                  </span>
                  <div className="inline-flex items-center bg-secondary border border-border rounded-md h-11">
                    <Button
                      variant="ghost"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-11 w-11 p-0 rounded-none hover:bg-primary/10 hover:text-primary"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[3rem] text-center font-bold text-lg tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => updateQuantity(quantity + 1)}
                      className="h-11 w-11 p-0 rounded-none hover:bg-primary/10 hover:text-primary"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={
                    selectedVariation
                      ? !selectedVariation.stock_quantity || selectedVariation.stock_quantity <= 0
                      : !product.stock_quantity || product.stock_quantity <= 0
                  }
                  size="lg"
                  className="w-full h-14 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm shadow-[0_8px_24px_-6px_hsl(var(--nori-red)/0.5)]"
                >
                  Ajouter au panier ·{' '}
                  {((selectedVariation ? selectedVariation.price : product.base_price) * quantity).toFixed(2)}{' '}
                  €
                </Button>
              </div>

              {/* Product Features */}
              <ProductFeatures />
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="nori-section-title text-primary mb-4">Détails du produit</h3>
                <div className="space-y-3 text-sm">
                  {product.product_type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium text-foreground">{product.product_type}</span>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origine:</span>
                      <span className="font-medium text-foreground">{product.origin}</span>
                    </div>
                  )}
                  {product.storage_conditions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conservation:</span>
                      <span className="font-medium text-foreground">{product.storage_conditions}</span>
                    </div>
                  )}
                  {product.shelf_life && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée de conservation:</span>
                      <span className="font-medium text-foreground">{product.shelf_life}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="nori-section-title text-primary mb-4">Conseils de préparation</h3>
                {product.preparation_tips ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {product.preparation_tips}
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Sortir du réfrigérateur 15 minutes avant cuisson</li>
                    <li>• Cuisson recommandée: grillé, poêlé ou au four</li>
                    <li>• Température interne: 63°C</li>
                    <li>• Accompagne parfaitement les légumes de saison</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts 
            currentProductId={product.id} 
            categoryId={product.category_id} 
          />
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default ProductDetail;
