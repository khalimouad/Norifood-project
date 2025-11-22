import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Apple } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      navigate('/');
    }

    setLoading(false);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
      navigate('/');
    }

    setLoading(false);
  };

  const handleSendOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Convert local format (0666666666) to international format (+212666666666)
    const internationalPhone = phoneNumber.startsWith('0') 
      ? `+212${phoneNumber.substring(1)}` 
      : `+212${phoneNumber}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: internationalPhone,
    });

    if (error) {
      toast({
        title: "Erreur d'envoi OTP",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOtpSent(true);
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre téléphone.",
      });
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Convert local format to international format for verification
    const internationalPhone = phoneNumber.startsWith('0') 
      ? `+212${phoneNumber.substring(1)}` 
      : `+212${phoneNumber}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: internationalPhone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      toast({
        title: "Erreur de vérification",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
      navigate('/');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: "Erreur de connexion Google",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: "Erreur de connexion Apple",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            Fresh N'Good
          </CardTitle>
          <CardDescription className="text-base">
            Connectez-vous pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleAppleSignIn}
              disabled={loading}
            >
              <Apple className="h-5 w-5 mr-3" />
              Continuer avec Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Tabs defaultValue="phone" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phone" className="text-xs sm:text-sm">
                <Phone className="h-4 w-4 mr-1" />
                Téléphone
              </TabsTrigger>
              <TabsTrigger value="signin" className="text-xs sm:text-sm">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-xs sm:text-sm">
                Inscription
              </TabsTrigger>
            </TabsList>

            {/* Phone OTP Tab */}
            <TabsContent value="phone" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 border border-input rounded-md bg-muted text-muted-foreground">
                        +212
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0666666666"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setPhoneNumber(value);
                          }
                        }}
                        maxLength={10}
                        required
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Format: 0666666666 (10 chiffres)
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? 'Envoi...' : 'Envoyer le code'}
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
                    <p className="text-xs text-muted-foreground">
                      Entrez le code reçu par SMS
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                      }}
                      disabled={loading}
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Vérification...' : 'Vérifier'}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            {/* Email Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">Prénom</Label>
                    <Input
                      id="signup-firstname"
                      name="firstName"
                      type="text"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Nom</Label>
                    <Input
                      id="signup-lastname"
                      name="lastName"
                      type="text"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Inscription...' : "S'inscrire"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;