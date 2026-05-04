import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
      toast({
        title: "App installable",
        description: "This app can be installed on your device!",
      });
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      toast({
        title: "App installed!",
        description: "Norifood has been installed on your device.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For debugging: show manual install button in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use the stored prompt
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast({
            title: "Installing app...",
            description: "Please wait while the app is being installed.",
          });
        } else {
          console.log('User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('Error during install prompt:', error);
        toast({
          title: "Installation failed",
          description: "Please try again or install manually from your browser menu.",
          variant: "destructive",
        });
      }
    } else {
      // Fallback: show manual installation instructions
      toast({
        title: "Manual Installation",
        description: "Look for the 'Install' option in your browser menu (⋮) or address bar.",
      });
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Installer Norifood</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {deferredPrompt ? "Accès rapide depuis votre écran d'accueil" : "Utilisez le menu de votre navigateur pour installer"}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex space-x-2">
        <Button
          onClick={handleInstallClick}
          className="flex-1 h-8 text-xs"
        >
          {deferredPrompt ? "Installer" : "Comment installer"}
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          className="flex-1 h-8 text-xs"
        >
          Plus tard
        </Button>
      </div>
    </div>
  );
};