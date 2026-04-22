import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Phone, Mail, MapPin, ArrowLeft, MessageCircle, Instagram, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="text-ocean hover:bg-ocean/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-ocean">Questions Fréquentes</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos produits et services
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-ocean text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Truck className="h-6 w-6 mr-2" />
                  Livraison & Retours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Quels sont les frais de livraison ?</h3>
                    <p className="text-gray-700">
                      La livraison est gratuite à partir de 350 DH d'achat. Elle est de 20 DH à partir de 250 DH et de 50 DH à moins de 250 DH.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Quels sont les jours de livraisons ?</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Casablanca : tous les jours sauf dimanche</li>
                      <li>• Rabat, Bouznika, Mohammedia, Temara : les vendredis</li>
                      <li>• Marrakech et Agadir : tous les jours sauf dimanche</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Conditions de retour</h3>
                    <p className="text-gray-700">
                      En cas d'erreur de livraison ou d'échange, tout produit à échanger ou à rembourser devra être retourné dans son ensemble et dans son emballage d'origine.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-seafoam text-white rounded-t-lg">
                <CardTitle>Questions sur les Produits</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Je n'ai pas l'habitude de consommer du poisson congelé, j'achète du frais.</h3>
                    <p className="text-gray-700">
                      N'ayez aucune crainte à consommer nos poissons car ils sont congelés à bord de nos bateaux qui pêchent en haute mer. En effet, une fois pêché, le poisson est congelé 30 minutes après, dans des tunnels à -40 degrés ce qui garantit une qualité du produit et une fraîcheur irréprochables. D'ailleurs, vous allez sentir l'odeur de la mer dès décongélation du produit !
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Est-ce que la chaîne de froid est respectée ?</h3>
                    <p className="text-gray-700">
                      Nous garantissons le respect total de la chaîne de froid, de la mer jusqu'à chez vous car nous maîtrisons tout le processus. En effet, nous pêchons avec nos propres bateaux, le poisson est transformé et packagé dans notre usine à Agadir et nous le transportons jusqu'à chez vous dans nos propres camionnettes frigorifiques.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Est-ce que le poisson est nettoyé ?</h3>
                    <p className="text-gray-700">
                      Nous avons les deux options : poisson nettoyé et entier. Nous avons aussi des filets de poissons et des produits élaborés.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Est-ce que tous vos produits sont marocains ?</h3>
                    <p className="text-gray-700">
                      Nos produits sont majoritairement locaux, poissons sauvages pêchés et congelés en haute mer. Nous importons également d'autres produits tels que : la noix de Saint-Jacques, les crevettes grises, les moules, les palourdes… L'origine du produit est toujours mentionnée avec un petit drapeau dans la case description.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-ocean text-white rounded-t-lg">
                <CardTitle>Conservation & Préparation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Est-ce que je peux conserver vos produits dans mon congélateur et pendant combien de temps ?</h3>
                    <p className="text-gray-700">
                      Oui bien sûr, ils arriveront chez vous congelés. Il faut les mettre directement au congélateur. La DLC est mentionnée sur l'étiquette du produit.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Comment dois-je décongeler le poisson ?</h3>
                    <p className="text-gray-700">
                      Vous devez sortir le poisson du congélateur et le laisser se dégivrer la nuit dans votre réfrigérateur ou bien dans de l'eau courante salée si vous êtes pressé. Il ne faut préparer le poisson qu'une fois complètement décongelé sinon il durcira à la cuisson.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-seafoam text-white rounded-t-lg">
                <CardTitle>Commandes & Paiement</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-2">Comment peut-on passer commande ?</h3>
                    <p className="text-gray-700 mb-2">Vous avez plusieurs choix :</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Via notre site de commande en ligne : freshngood.ma, vous pouvez payer en ligne par carte bancaire</li>
                      <li>• Par téléphone ou WhatsApp au : 0608 611 511 (Marrakech)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-ocean text-white rounded-t-lg">
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-ocean/10 rounded-full">
                        <Phone className="h-6 w-6 text-ocean" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ocean">Téléphone</h4>
                        <p className="text-gray-600">06 08 611 511</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-ocean/10 rounded-full">
                        <Mail className="h-6 w-6 text-ocean" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ocean">Email</h4>
                        <p className="text-gray-600">sales@freshngood.ma</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-seafoam/10 rounded-full">
                        <MessageCircle className="h-6 w-6 text-seafoam" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-seafoam">Facebook</h4>
                        <p className="text-gray-600">freshngood.ma</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-seafoam/10 rounded-full">
                        <Instagram className="h-6 w-6 text-seafoam" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-seafoam">Instagram</h4>
                        <p className="text-gray-600">freshngood.ma</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-ocean text-white rounded-t-lg">
                <CardTitle>Où nous trouver ?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-ocean/10 rounded-full">
                    <MapPin className="h-6 w-6 text-ocean" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ocean">Magasin Marrakech</h4>
                    <p className="text-gray-600">Immeuble Assala – 50 av Med 6 Marrakech</p>
                    <p className="text-gray-600">Tél : 0608 611 511</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}