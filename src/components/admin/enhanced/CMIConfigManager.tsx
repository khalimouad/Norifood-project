import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CMIConfig {
  id: string;
  merchant_id: string;
  merchant_key: string;
  gateway_url: string;
  is_active: boolean;
  test_mode: boolean;
}

export function CMIConfigManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<CMIConfig | null>(null);
  const [formData, setFormData] = useState({
    merchant_id: "",
    merchant_key: "",
    gateway_url: "https://payment.cmi.co.ma/fim/api",
    is_active: true,
    test_mode: true,
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("cmi_config")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setConfig(data);
        setFormData({
          merchant_id: data.merchant_id,
          merchant_key: data.merchant_key,
          gateway_url: data.gateway_url,
          is_active: data.is_active,
          test_mode: data.test_mode,
        });
      }
    } catch (error: any) {
      console.error("Error fetching CMI config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        merchant_id: formData.merchant_id,
        merchant_key: formData.merchant_key,
        gateway_url: formData.gateway_url,
        is_active: formData.is_active,
        test_mode: formData.test_mode,
      };

      if (config?.id) {
        const { error } = await supabase
          .from("cmi_config")
          .update(updateData)
          .eq("id", config.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cmi_config")
          .insert([updateData]);

        if (error) throw error;
      }

      toast({
        title: "Configuration sauvegardée",
        description: "La configuration CMI a été mise à jour avec succès",
      });

      await fetchConfig();
    } catch (error: any) {
      console.error("Error saving CMI config:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuration CMI</h2>
        <p className="text-muted-foreground">
          Gérez les paramètres de paiement CMI pour votre boutique
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Les informations sensibles (Merchant Key) sont stockées de manière sécurisée. Contactez CMI Maroc pour obtenir vos identifiants de production.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Paramètres CMI
          </CardTitle>
          <CardDescription>
            Configurez votre passerelle de paiement CMI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="merchant_id">Merchant ID *</Label>
              <Input
                id="merchant_id"
                value={formData.merchant_id}
                onChange={(e) =>
                  setFormData({ ...formData, merchant_id: e.target.value })
                }
                placeholder="Votre Merchant ID CMI"
              />
              <p className="text-sm text-muted-foreground">
                Identifiant unique fourni par CMI
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant_key">Merchant Key *</Label>
              <Input
                id="merchant_key"
                type="password"
                value={formData.merchant_key}
                onChange={(e) =>
                  setFormData({ ...formData, merchant_key: e.target.value })
                }
                placeholder="Votre clé secrète CMI"
              />
              <p className="text-sm text-muted-foreground">
                Clé secrète pour sécuriser les transactions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gateway_url">URL de la Passerelle *</Label>
              <Input
                id="gateway_url"
                value={formData.gateway_url}
                onChange={(e) =>
                  setFormData({ ...formData, gateway_url: e.target.value })
                }
                placeholder="https://payment.cmi.co.ma/fim/api"
              />
              <p className="text-sm text-muted-foreground">
                URL de l'API CMI (production ou test)
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="test_mode">Mode Test</Label>
                <p className="text-sm text-muted-foreground">
                  Activer pour utiliser l'environnement de test CMI
                </p>
              </div>
              <Switch
                id="test_mode"
                checked={formData.test_mode}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, test_mode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Activer CMI</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre les paiements via CMI sur le site
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            <strong>Mode Test :</strong> Utilisez l'environnement de test CMI pour effectuer des transactions fictives
          </p>
          <p className="text-muted-foreground">
            <strong>Mode Production :</strong> Configurez avec vos vraies clés CMI pour accepter de vrais paiements
          </p>
          <p className="text-muted-foreground">
            <strong>Support :</strong> Pour toute question, contactez le support technique CMI
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
