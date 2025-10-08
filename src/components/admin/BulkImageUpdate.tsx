import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BulkImageUpdate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleBulkUpdate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('bulk-update-product-images', {
        method: 'POST',
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: "Mise à jour terminée",
        description: `${data.updated} produits mis à jour avec succès`,
      });
    } catch (error) {
      console.error('Error updating product images:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Mise à jour groupée des images
        </CardTitle>
        <CardDescription>
          Attribuer automatiquement les images générées aux produits qui n'en ont pas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleBulkUpdate} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Mise à jour en cours...' : 'Lancer la mise à jour'}
        </Button>

        {result && (
          <div className="space-y-3">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>{result.updated}</strong> produits mis à jour
              </AlertDescription>
            </Alert>

            {result.errors > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{result.errors}</strong> erreurs rencontrées
                </AlertDescription>
              </Alert>
            )}

            {result.notMatched > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{result.notMatched}</strong> produits sans correspondance d'image
                  {result.notMatchedProducts && result.notMatchedProducts.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium">
                        Voir la liste
                      </summary>
                      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {result.notMatchedProducts.slice(0, 10).map((name: string, idx: number) => (
                          <li key={idx}>• {name}</li>
                        ))}
                        {result.notMatchedProducts.length > 10 && (
                          <li>... et {result.notMatchedProducts.length - 10} autres</li>
                        )}
                      </ul>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
