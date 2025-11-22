import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { 
  Plus, 
  Minus, 
  ArrowLeft,
  Star,
  Truck,
  Shield,
  Clock,
  Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
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

  const images = product.images || [product.image_url || "/placeholder.svg"];

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
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/50">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-border"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.featured && (
                    <Badge className="bg-accent text-accent-foreground">Produit Vedette</Badge>
                  )}
                  {product.stock_quantity && product.stock_quantity > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                      <Check className="h-3 w-3 mr-1" />
                      En Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 dark:text-red-400 dark:border-red-400">
                      Rupture de Stock
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-4">
                  {selectedVariation ? selectedVariation.price : product.base_price} DH
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    {selectedVariation ? `/ pièce (${selectedVariation.weight_kg}kg)` : `/ ${product.unit_type}`}
                  </span>
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Product Variations */}
              {variations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Choisir une pièce:</h3>
                  <div className="grid gap-3">
                    {variations.map((variation) => (
                      <div
                        key={variation.id}
                        onClick={() => setSelectedVariation(variation)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                          selectedVariation?.id === variation.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-foreground">{variation.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {variation.weight_kg}kg • Stock: {variation.stock_quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{variation.price} DH</p>
                            <p className="text-xs text-muted-foreground">
                              {(variation.price / variation.weight_kg!).toFixed(2)} DH/kg
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">Quantité:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[3rem] text-center font-medium text-lg text-foreground">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(quantity + 1)}
                      className="h-10 w-10 p-0"
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
                  className="w-full"
                  size="lg"
                  variant="cart"
                >
                  Ajouter au Panier - {((selectedVariation ? selectedVariation.price : product.base_price) * quantity).toFixed(2)} DH
                </Button>
              </div>

              {/* Product Features */}
              <Card className="border-0 bg-muted/50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Livraison Express</p>
                        <p className="text-xs text-muted-foreground">Même jour ou 24h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Fraîcheur Garantie</p>
                        <p className="text-xs text-muted-foreground">Chaîne du froid</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Préparation Express</p>
                        <p className="text-xs text-muted-foreground">Prêt en 2h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-16">

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Détails du Produit</h3>
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
              <div>
                <h3 className="font-bold text-lg mb-4">Conseils de Préparation</h3>
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
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default ProductDetail;