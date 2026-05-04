import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Apple, ArrowLeft, ChevronLeft } from 'lucide-react';
import { NorifoodLogo } from '@/components/NorifoodLogo';
import salmonImage from '@/assets/salmon.jpg';

type View = 'home' | 'signin' | 'signup';

const Auth = () => {
  const [view, setView] = useState<View>('home');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
    })();
  }, [navigate]);

  const intl = (n: string) => (n.startsWith('0') ? `+212${n.substring(1)}` : `+212${n}`);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const fd = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { first_name: fd.get('firstName'), last_name: fd.get('lastName') },
      },
    });
    if (error) {
      toast({ title: "Erreur d'inscription", description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Inscription réussie', description: 'Vérifiez votre email.' });
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const fd = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    });
    if (error) {
      toast({ title: 'Erreur de connexion', description: error.message, variant: 'destructive' });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleSendOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: intl(phoneNumber) });
    if (error) {
      toast({ title: "Erreur d'envoi", description: error.message, variant: 'destructive' });
    } else {
      setOtpSent(true);
      toast({ title: 'Code envoyé', description: 'Vérifiez votre SMS.' });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: intl(phoneNumber),
      token: otp,
      type: 'sms',
    });
    if (error) {
      toast({ title: 'Erreur de vérification', description: error.message, variant: 'destructive' });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      toast({
        title: `Erreur de connexion ${provider}`,
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-background flex flex-col">
      {view === 'home' ? (
        <HomeView
          onSignIn={() => setView('signin')}
          onSignUp={() => setView('signup')}
          onBack={() => navigate('/')}
        />
      ) : (
        <FormView
          view={view}
          loading={loading}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          otp={otp}
          setOtp={setOtp}
          otpSent={otpSent}
          setOtpSent={setOtpSent}
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
          handleSendOTP={handleSendOTP}
          handleVerifyOTP={handleVerifyOTP}
          handleOAuth={handleOAuth}
          onBack={() => setView('home')}
          onSwap={() => setView(view === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </div>
  );
};

const HomeView = ({
  onSignIn,
  onSignUp,
  onBack,
}: {
  onSignIn: () => void;
  onSignUp: () => void;
  onBack: () => void;
}) => (
  <div className="relative flex-1 flex flex-col items-center justify-between px-6 py-10">
    <button
      onClick={onBack}
      className="self-start inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Retour
    </button>

    <div className="flex flex-col items-center gap-8 max-w-sm w-full mt-6">
      <NorifoodLogo size="xl" />

      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border bg-card">
        <img
          src={salmonImage}
          alt="Sélection Norifood"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/80 backdrop-blur-sm border-t border-border">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-1">
            Norifood Pro
          </p>
          <p className="text-foreground text-sm font-semibold">
            Votre partenaire d'ingrédients asiatiques
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 w-full max-w-sm pt-8">
      <Button
        onClick={onSignIn}
        size="lg"
        className="w-full h-12 rounded-md bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm shadow-[0_8px_24px_-6px_hsl(var(--nori-red)/0.5)]"
      >
        Se connecter
      </Button>
      <Button
        onClick={onSignUp}
        size="lg"
        variant="outline"
        className="w-full h-12 rounded-md border-border bg-transparent text-foreground hover:bg-secondary font-semibold uppercase tracking-wider text-sm"
      >
        Créer un compte
      </Button>
    </div>
  </div>
);

interface FormViewProps {
  view: 'signin' | 'signup';
  loading: boolean;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  otp: string;
  setOtp: (v: string) => void;
  otpSent: boolean;
  setOtpSent: (v: boolean) => void;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSendOTP: (e: React.FormEvent<HTMLFormElement>) => void;
  handleVerifyOTP: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOAuth: (provider: 'google' | 'apple') => void;
  onBack: () => void;
  onSwap: () => void;
}

const FormView = ({
  view,
  loading,
  phoneNumber,
  setPhoneNumber,
  otp,
  setOtp,
  otpSent,
  setOtpSent,
  handleSignIn,
  handleSignUp,
  handleSendOTP,
  handleVerifyOTP,
  handleOAuth,
  onBack,
  onSwap,
}: FormViewProps) => (
  <div className="relative flex-1 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <div className="flex flex-col items-center mb-6">
        <NorifoodLogo size="md" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-2xl font-extrabold text-center mb-1">
          {view === 'signin' ? 'Bon retour' : 'Créer un compte'}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {view === 'signin'
            ? 'Connectez-vous pour accéder à votre catalogue'
            : 'Rejoignez la communauté des pros Norifood'}
        </p>

        {view === 'signin' ? (
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-secondary border border-border h-10">
              <TabsTrigger
                value="email"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Mail className="h-3.5 w-3.5 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Phone className="h-3.5 w-3.5 mr-1" />
                Téléphone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" placeholder="votre@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input id="signin-password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm"
                  disabled={loading}
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 border border-border rounded-md bg-secondary text-muted-foreground text-sm">
                        +212
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0xxxxxxxxx"
                        value={phoneNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          if (v.length <= 10) setPhoneNumber(v);
                        }}
                        maxLength={10}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm"
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? 'Envoi…' : 'Envoyer le code'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Code de vérification</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-secondary border-border"
                      onClick={() => { setOtpSent(false); setOtp(''); }}
                      disabled={loading}
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-nori-light"
                      disabled={loading}
                    >
                      {loading ? '…' : 'Vérifier'}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="signup-firstname">Prénom</Label>
                <Input id="signup-firstname" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-lastname">Nom</Label>
                <Input id="signup-lastname" name="lastName" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Mot de passe</Label>
              <Input id="signup-password" name="password" type="password" required minLength={6} />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-bold uppercase tracking-wider text-sm"
              disabled={loading}
            >
              {loading ? '…' : 'Créer un compte'}
            </Button>
          </form>
        )}

        <div className="relative my-5">
          <Separator className="bg-border" />
          <div className="absolute inset-0 flex justify-center">
            <span className="-mt-2.5 px-3 bg-card text-xs uppercase tracking-wider text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <Button
            variant="outline"
            className="w-full h-11 bg-secondary border-border hover:bg-secondary/70 text-foreground"
            onClick={() => handleOAuth('google')}
            disabled={loading}
          >
            <svg className="h-4 w-4 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 bg-secondary border-border hover:bg-secondary/70 text-foreground"
            onClick={() => handleOAuth('apple')}
            disabled={loading}
          >
            <Apple className="h-4 w-4 mr-3" />
            Apple
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {view === 'signin' ? "Pas encore de compte ? " : 'Déjà inscrit ? '}
          <button
            type="button"
            onClick={onSwap}
            className="text-primary font-semibold hover:text-nori-light transition-colors"
          >
            {view === 'signin' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </p>
      </div>
    </div>
  </div>
);

export default Auth;
