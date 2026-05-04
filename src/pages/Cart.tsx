import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpdate = (id: string, n: number) => {
    if (n < 1) return removeItem(id);
    updateQuantity(id, n);
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'nori10') {
      setAppliedPromo('NORI10');
      toast({ title: 'Code appliqué', description: '10% de réduction' });
    } else {
      toast({ title: 'Code invalide', variant: 'destructive' });
    }
    setPromoCode('');
  };

  const subtotal = getTotalPrice();
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 200 ? 0 : 25;
  const total = subtotal - discount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-20 md:pb-0">
          <div className="container mx-auto px-4 py-20 text-center max-w-md">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
              <ShoppingBag className="h-9 w-9 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Découvrez notre catalogue d'ingrédients sushi, asiatiques et surgelés.
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm"
              >
                Voir le catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-32 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
          {/* Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="nori-section-title text-primary mb-1">Mon panier</p>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Votre panier ({items.length})
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-muted-foreground hover:text-primary uppercase tracking-wide font-semibold"
            >
              Vider
            </button>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 md:p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover bg-secondary border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                    {item.name}
                  </h3>
                  {item.weight && (
                    <p className="text-xs text-muted-foreground">{item.weight}kg</p>
                  )}
                  <p className="text-base md:text-lg font-extrabold text-primary mt-1">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="inline-flex items-center bg-secondary border border-border rounded-md h-8">
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      className="h-8 w-7 inline-flex items-center justify-center hover:text-primary"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      className="h-8 w-7 inline-flex items-center justify-center hover:text-primary"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Retirer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            {appliedPromo ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary font-bold">
                    Code {appliedPromo}
                  </p>
                  <p className="text-sm text-muted-foreground">10% de réduction appliquée</p>
                </div>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="text-xs text-muted-foreground hover:text-primary uppercase tracking-wide font-semibold"
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Code promo (essayez NORI10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-secondary border-border"
                />
                <Button
                  onClick={applyPromo}
                  disabled={!promoCode}
                  className="bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide text-xs"
                >
                  Appliquer
                </Button>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-semibold tabular-nums">{subtotal.toFixed(2)} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>Réduction ({appliedPromo})</span>
                <span className="font-semibold tabular-nums">-{discount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-semibold tabular-nums">
                {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toFixed(2)} €`}
              </span>
            </div>
            {subtotal < 200 && (
              <p className="text-xs text-muted-foreground">
                Livraison gratuite à partir de 200 €.
              </p>
            )}
            <div className="border-t border-border pt-3 flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider font-bold">Total</span>
              <span className="text-2xl font-extrabold text-primary tabular-nums">
                {total.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 space-y-2.5">
            <Link to="/checkout" className="block">
              <Button
                size="lg"
                className="w-full h-14 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm shadow-[0_8px_24px_-6px_hsl(var(--nori-red)/0.5)]"
              >
                Initier la commande
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-md border-border bg-transparent hover:bg-secondary uppercase tracking-wider text-sm"
              >
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Cart;
