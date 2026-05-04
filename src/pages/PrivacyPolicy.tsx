import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Lock, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PrivacyPolicy() {
  return <div className="min-h-screen bg-gradient-to-br from-pearl to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="text-ocean bg-slate-950 hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-ocean">Politique de Confidentialité</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Norifood s'engage à protéger votre vie privée et vos données personnelles
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-ocean to-ocean/90 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Politique de Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  
                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">1. Collecte des informations</h3>
                    <p className="text-justify mb-4">
                      Norifood SARL collecte des informations personnelles lorsque vous visitez notre site web, passez une commande, vous inscrivez à notre newsletter ou contactez notre service client. Ces informations peuvent inclure votre nom, votre adresse email, votre adresse postale, votre numéro de téléphone et vos préférences d'achat.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">2. Utilisation des informations</h3>
                    <p className="text-justify mb-2">Nous utilisons vos informations personnelles pour :</p>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li>Traiter et expédier vos commandes</li>
                      <li>Vous envoyer des confirmations de commande et des mises à jour sur l'état de livraison</li>
                      <li>Personnaliser votre expérience d'achat</li>
                      <li>Vous envoyer des informations sur nos produits et promotions (si vous y avez consenti)</li>
                      <li>Améliorer notre service client</li>
                      <li>Respecter nos obligations légales</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">3. Partage des informations</h3>
                    <p className="text-justify mb-4">
                      Norifood ne vend, n'échange ni ne loue vos informations personnelles à des tiers. Nous pouvons partager vos informations avec nos partenaires de confiance uniquement dans le but de vous fournir nos services (transporteurs, services de paiement, etc.). Ces partenaires sont tenus de maintenir la confidentialité de vos informations.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">4. Sécurité des données</h3>
                    <p className="text-justify mb-4">
                      Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la divulgation, la modification ou la destruction. Vos données de paiement sont traitées de manière sécurisée par le Centre Monétique Interbancaire (CMI).
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">5. Cookies</h3>
                    <p className="text-justify mb-4">
                      Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous aident à comprendre comment vous utilisez notre site et à personnaliser votre expérience. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela peut affecter le fonctionnement de certaines parties du site.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">6. Conservation des données</h3>
                    <p className="text-justify mb-4">
                      Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services, respecter nos obligations légales et résoudre les litiges. Les données de commande sont conservées pendant la durée requise par la loi comptable marocaine.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">7. Vos droits</h3>
                    <p className="text-justify mb-2">Conformément à la loi marocaine, vous disposez des droits suivants :</p>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li>Droit d'accès à vos données personnelles</li>
                      <li>Droit de rectification en cas d'informations inexactes</li>
                      <li>Droit de suppression de vos données personnelles</li>
                      <li>Droit d'opposition au traitement de vos données</li>
                      <li>Droit de portabilité de vos données</li>
                    </ul>
                    <p className="text-justify">
                      Pour exercer ces droits, contactez-nous à l'adresse contact@norifood.ma ou par courrier à notre adresse postale.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">8. Newsletter et communications marketing</h3>
                    <p className="text-justify mb-4">
                      Si vous vous inscrivez à notre newsletter, nous utiliserons votre adresse email pour vous envoyer des informations sur nos produits, promotions et actualités. Vous pouvez vous désabonner à tout moment en cliquant sur le lien de désinscription présent dans chaque email ou en nous contactant directement.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">9. Modifications de la politique</h3>
                    <p className="text-justify mb-4">
                      Norifood se réserve le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec la date de mise à jour. Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la façon dont nous protégeons vos informations.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">10. Contact</h3>
                    <p className="text-justify mb-4">
                      Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter à :
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold">Norifood SARL</p>
                      <p>Email : contact@norifood.ma</p>
                      <p>Téléphone : 0608 611 511</p>
                      <p>Adresse : Imm. Assala - 50 Gueliz, Bd Mohamed VI, Marrakesh 40000</p>
                    </div>
                  </section>

                  <section>
                    <p className="text-sm text-gray-600 mt-8">
                      Dernière mise à jour : Janvier 2024
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}