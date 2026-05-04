import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Package, RefreshCw, Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Shipping() {
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
              <Truck className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-ocean">Livraison & Retours</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos conditions de livraison et notre politique de retour
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-ocean to-ocean/90 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Truck className="h-6 w-6 mr-2" />
                  Conditions de Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Zones de livraison</h3>
                    <p className="text-gray-700 mb-3">
                      Les produits sont livrés à l'adresse indiquée par le consommateur sur le bon de commande et uniquement dans les villes suivantes :
                    </p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• <strong>Marrakech</strong> : tous les jours sauf dimanche</li>
                      <li>• <strong>Casablanca</strong> : tous les jours sauf dimanche</li>
                      <li>• <strong>Agadir</strong> : tous les jours sauf dimanche</li>
                      <li>• <strong>Rabat, Bouznika, Mohammedia, Temara</strong> : les vendredis</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Frais de livraison</h3>
                    <div className="bg-gradient-to-r from-seafoam/10 to-ocean/10 p-4 rounded-lg">
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Package className="h-5 w-5 text-seafoam mr-2" />
                          <span><strong>Gratuite</strong> à partir de 350 DH d'achat</span>
                        </li>
                        <li className="flex items-center">
                          <Package className="h-5 w-5 text-ocean mr-2" />
                          <span><strong>20 DH</strong> à partir de 250 DH d'achat</span>
                        </li>
                        <li className="flex items-center">
                          <Package className="h-5 w-5 text-coral mr-2" />
                          <span><strong>50 DH</strong> pour les commandes inférieures à 250 DH</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Délais de livraison</h3>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-ocean mt-1" />
                      <div>
                        <p className="text-gray-700">
                          La commande sera expédiée au plus tard dans un délai de <strong>7 jours ouvrables</strong> à compter du jour suivant celui où le consommateur a effectué le paiement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Processus de livraison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-ocean mb-2">1. Passez votre commande</h4>
                        <p className="text-sm text-gray-600">Spécifiez la méthode de livraison souhaitée</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-ocean mb-2">2. Confirmation</h4>
                        <p className="text-sm text-gray-600">Vous recevrez un message de confirmation</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-ocean mb-2">3. Expédition</h4>
                        <p className="text-sm text-gray-600">Vous recevrez un email d'expédition</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-ocean mb-2">4. Réception</h4>
                        <p className="text-sm text-gray-600">Récupérez votre commande</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Respect de la chaîne de froid</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        Nous garantissons le respect total de la chaîne de froid, de la mer jusqu'à chez vous. 
                        Nos produits sont transportés dans nos propres camionnettes frigorifiques pour maintenir 
                        la fraîcheur et la qualité optimales.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-seafoam to-seafoam/90 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-6 w-6 mr-2" />
                  Politique de Retour
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Délai de rétractation</h3>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        Le consommateur dispose d'un délai de <strong>1 jour</strong> pour retourner sa commande, 
                        à ses frais, si les produits ne lui conviennent pas. Ce délai court à compter du jour 
                        de la livraison de la commande.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Conditions de retour</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-ocean rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Les produits emballés ne devront pas avoir été descellés ou décongelés</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-ocean rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Les produits doivent être retournés dans leur emballage d'origine complet et intact</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-ocean rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Les produits doivent être en parfait état de revente</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-ocean rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Tout retour doit être signalé au préalable à notre service client</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Problèmes de livraison</h3>
                    <p className="text-gray-700 mb-3">
                      En cas d'anomalie concernant la livraison (avarie, produit manquant, colis endommagé, produits cassés...), 
                      vous devez impérativement :
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                      <li>Indiquer les réserves manuscrites sur le bon de livraison avec votre signature</li>
                      <li>Confirmer cette anomalie par courrier recommandé au transporteur dans les 2 jours ouvrables</li>
                      <li>Transmettre une copie de ce courrier à notre service client</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ocean mb-3">Remboursement</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-2">
                        En cas d'exercice du droit de rétractation, vous avez le choix entre :
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Un remboursement via un avoir utilisable sur le site norifood.ma</li>
                        <li>• Un échange du produit (réexpédition aux frais du consommateur)</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-3">
                        Délai de remboursement : 15 jours (pouvant être étendu à 45 jours selon les cas)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-ocean to-ocean/90 text-white rounded-t-lg">
                <CardTitle>Service Client</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-ocean/10 rounded-full">
                      <Phone className="h-6 w-6 text-ocean" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ocean">Téléphone</h4>
                      <p className="text-gray-600">0608 611 511</p>
                      <p className="text-sm text-gray-500">Lun-Ven: 9h-12h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-ocean/10 rounded-full">
                      <Mail className="h-6 w-6 text-ocean" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ocean">Email</h4>
                      <p className="text-gray-600">support@norifood.ma</p>
                      <p className="text-sm text-gray-500">Réponse sous 24h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-ocean/10 rounded-full">
                      <MapPin className="h-6 w-6 text-ocean" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ocean">Adresse</h4>
                      <p className="text-gray-600">Imm. Assala - 50 Gueliz</p>
                      <p className="text-gray-600">Bd Mohamed VI, Marrakesh 40000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}