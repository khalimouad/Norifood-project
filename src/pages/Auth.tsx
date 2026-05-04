import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Apple, ArrowLeft } from 'lucide-react';
import { NorifoodLogo } from '@/components/NorifoodLogo';

const Auth = () => {
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
    const formData = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
        },
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
    const formData = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    if (error) {
      toast({ title: 'Erreur de connexion', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Connexion réussie', description: 'Bienvenue !' });
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
      toast({ title: 'Connexion réussie', description: 'Bienvenue !' });
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
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-4">
      {/* Ambient red glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <NorifoodLogo size="lg" showTagline />
          <p className="mt-6 text-sm text-muted-foreground text-center max-w-xs">
            Connectez-vous pour accéder à votre catalogue professionnel
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          {/* OAuth */}
          <div className="space-y-3 mb-5">
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
              Continuer avec Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 bg-secondary border-border hover:bg-secondary/70 text-foreground"
              onClick={() => handleOAuth('apple')}
              disabled={loading}
            >
              <Apple className="h-4 w-4 mr-3" />
              Continuer avec Apple
            </Button>
          </div>

          <div className="relative my-5">
            <Separator className="bg-border" />
            <div className="absolute inset-0 flex justify-center">
              <span className="-mt-2.5 px-3 bg-card text-xs uppercase tracking-wider text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Tabs defaultValue="phone" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border h-10">
              <TabsTrigger value="phone" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Phone className="h-3.5 w-3.5 mr-1" />
                Téléphone
              </TabsTrigger>
              <TabsTrigger value="signin" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mail className="h-3.5 w-3.5 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Inscription
              </TabsTrigger>
            </TabsList>

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
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide"
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? 'Envoi…' : 'Se connecter'}
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

            <TabsContent value="signin">
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
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide"
                  disabled={loading}
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
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
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-nori-light font-semibold uppercase tracking-wide"
                  disabled={loading}
                >
                  {loading ? '…' : 'Créer un compte'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 uppercase tracking-[0.2em]">
          Frozen · Asian · Sushi
        </p>
      </div>
    </div>
  );
};

export default Auth;
