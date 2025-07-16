import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Gavel, Shield, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pearl to-white py-12">
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
              <Gavel className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-ocean">Conditions d'Utilisation</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conditions régissant l'utilisation du site web freshngood.ma
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-ocean to-ocean/90 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Conditions d'Utilisation du Site Web
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  
                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">1. Objet</h3>
                    <p className="text-justify mb-4">
                      Les présentes conditions d'utilisation régissent l'accès et l'utilisation du site web freshngood.ma (ci-après "le Site") exploité par Fresh N'Good SARL. L'utilisation du Site implique l'acceptation pleine et entière des présentes conditions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">2. Définitions</h3>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li><strong>Site</strong> : le site web freshngood.ma et toutes ses pages</li>
                      <li><strong>Utilisateur</strong> : toute personne accédant au Site</li>
                      <li><strong>Services</strong> : l'ensemble des services proposés sur le Site</li>
                      <li><strong>Contenu</strong> : tous les éléments présents sur le Site (textes, images, vidéos, etc.)</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">3. Accès au Site</h3>
                    <p className="text-justify mb-4">
                      L'accès au Site est gratuit pour tout utilisateur disposant d'un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.
                    </p>
                    <p className="text-justify mb-4">
                      L'utilisateur est seul responsable du bon fonctionnement de son équipement informatique et de son accès Internet. Fresh N'Good se réserve le droit de refuser l'accès au Site, unilatéralement et sans notification préalable, à tout utilisateur ne respectant pas les présentes conditions d'utilisation.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">4. Utilisation du Site</h3>
                    <p className="text-justify mb-2">L'utilisateur s'engage à utiliser le Site de manière conforme à sa destination et s'interdit notamment :</p>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li>D'utiliser le Site à des fins illégales ou non autorisées</li>
                      <li>De porter atteinte à l'ordre public ou aux bonnes mœurs</li>
                      <li>De violer les droits de propriété intellectuelle de Fresh N'Good ou de tiers</li>
                      <li>De diffuser des contenus violents, diffamatoires ou contraires à la loi</li>
                      <li>De perturber le bon fonctionnement du Site</li>
                      <li>De tenter d'accéder de manière non autorisée au Site ou aux systèmes informatiques</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">5. Propriété intellectuelle</h3>
                    <p className="text-justify mb-4">
                      Tous les éléments du Site (textes, images, vidéos, logos, etc.) sont protégés par le droit d'auteur, le droit des marques et/ou tout autre droit de propriété intellectuelle. Ces éléments sont la propriété exclusive de Fresh N'Good ou de ses partenaires.
                    </p>
                    <p className="text-justify mb-4">
                      Toute reproduction, distribution, modification ou utilisation des contenus du Site à des fins commerciales est strictement interdite sans autorisation préalable écrite de Fresh N'Good.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">6. Données personnelles</h3>
                    <p className="text-justify mb-4">
                      Fresh N'Good s'engage à respecter la vie privée de ses utilisateurs. Les modalités de traitement des données personnelles sont détaillées dans notre Politique de Confidentialité, accessible depuis le Site.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">7. Responsabilité</h3>
                    <p className="text-justify mb-4">
                      Fresh N'Good s'efforce de fournir des informations exactes et à jour sur le Site. Cependant, la société ne peut garantir l'exactitude, la complétude ou la pertinence des informations diffusées.
                    </p>
                    <p className="text-justify mb-4">
                      Fresh N'Good ne saurait être tenue responsable des dommages de toute nature qui pourraient résulter de l'utilisation du Site ou de l'impossibilité d'y accéder.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">8. Disponibilité du Site</h3>
                    <p className="text-justify mb-4">
                      Fresh N'Good s'efforce d'assurer la disponibilité du Site 24h/24 et 7j/7. Cependant, la société se réserve le droit d'interrompre l'accès au Site pour des raisons de maintenance, de mise à jour ou pour toute autre raison technique.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">9. Liens hypertextes</h3>
                    <p className="text-justify mb-4">
                      Le Site peut contenir des liens vers d'autres sites web. Fresh N'Good n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur utilisation.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">10. Modifications</h3>
                    <p className="text-justify mb-4">
                      Fresh N'Good se réserve le droit de modifier à tout moment les présentes conditions d'utilisation. Les modifications prendront effet dès leur publication sur le Site. Il est recommandé aux utilisateurs de consulter régulièrement ces conditions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">11. Droit applicable et juridiction</h3>
                    <p className="text-justify mb-4">
                      Les présentes conditions d'utilisation sont régies par le droit marocain. En cas de litige, et après tentative de résolution amiable, les tribunaux marocains seront seuls compétents.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">12. Contact</h3>
                    <p className="text-justify mb-4">
                      Pour toute question relative aux présentes conditions d'utilisation, vous pouvez nous contacter :
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold">Fresh N'Good SARL</p>
                      <p>Email : contact@freshngood.ma</p>
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
    </div>
  );
}