import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, FileText, Shield, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfSale() {
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
              <Scale className="h-12 w-12 text-ocean mr-3" />
              <h1 className="text-4xl font-bold text-ocean">Conditions de Vente</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les présentes conditions générales régissent l'ensemble des transactions établies sur le site freshngood.ma
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-ocean text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Conditions Générales de Vente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  
                  <section>
                    <p className="text-justify mb-4">
                      Toute prise de commande au titre d'un produit figurant au sein de la boutique en ligne du site web freshngood.ma suppose la consultation préalable des présentes conditions générales. En conséquence, le consommateur reconnaît être parfaitement informé du fait que son accord concernant le contenu des présentes conditions générales ne nécessite pas la signature manuscrite de ce document, dans la mesure où le client souhaite commander en ligne les produits présentés dans le cadre de la boutique du site web.
                    </p>
                    
                    <p className="text-justify mb-4">
                      Le consommateur dispose de la faculté de sauvegarder ou d'éditer les présentes conditions générales, étant précisé que tant la sauvegarde que l'édition de ce document relèvent de sa seule responsabilité. Le consommateur, préalablement à sa commande, déclare que l'acquisition de ces produits est sans rapport direct avec son activité professionnelle, leur acquisition étant réservée à une utilisation personnelle de sa part. En tant que consommateur, le client dispose donc de droits spécifiques, qui seraient remis en cause dans l'hypothèse où les produits ou services acquis dans le cadre du site web auraient en réalité un rapport avec son activité professionnelle.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Informations sur la boutique en ligne</h3>
                    <p className="text-justify mb-2">La boutique en ligne dans le cadre du site web mentionne les informations suivantes :</p>
                    <ul className="list-disc pl-6 space-y-1 mb-4">
                      <li>Notice légale permettant une identification précise de la société freshngood.ma</li>
                      <li>Présentation des caractéristiques essentielles des biens proposés</li>
                      <li>Indication, en Dirham du prix des biens, ainsi que, le cas échéant, des frais de livraison</li>
                      <li>Indication des modalités de paiement, de livraison, ou d'exécution</li>
                      <li>L'existence d'un droit de rétractation</li>
                      <li>La durée de validité de l'offre ou du prix</li>
                      <li>L'ensemble de ces informations sont présentées en langue française, espagnol et anglaise.</li>
                    </ul>
                    <p className="text-justify">
                      Le consommateur déclare avoir la pleine capacité juridique lui permettant de s'engager au titre des présentes conditions générales
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 1 : Intégralité</h3>
                    <p className="text-justify">
                      Les présentes conditions générales expriment l'intégralité des obligations des parties. En ce sens, le consommateur est réputé accepter sans réserve l'intégralité des dispositions prévues dans ces conditions générales. Aucune condition générale ou spécifique figurant dans les documents envoyés ou remis par le consommateur ne pourra s'intégrer aux présentes, dès lors que ces documents seraient incompatibles avec ces conditions générales.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 2 : Objet</h3>
                    <p className="text-justify">
                      Le présent contrat est un contrat à distance qui a pour objet de définir les droits et obligations des parties dans le cadre de la vente des produits de la société FRESH N'GOOD SARL, sur Internet, par l'intermédiaire de la plate-forme e-commerce.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 3 : Documents contractuels</h3>
                    <p className="text-justify">
                      Le présent contrat est formé par les documents contractuels suivants, présentés par ordre hiérarchique décroissant : les présentes conditions générales ; le bon de commande. En cas de contradiction entre les dispositions contenues dans les documents de rang différent, les dispositions du document de rang supérieur prévaudront.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 4 : Entrée en vigueur – durée</h3>
                    <p className="text-justify">
                      Les présentes conditions générales entrent en vigueur à la date de signature du bon de commande. Les présentes conditions générales sont conclues pour la durée nécessaire à la fourniture des biens et services souscrits, jusqu'à l'extinction des garanties dûes par la société freshngood.ma.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 5 : Signature électronique</h3>
                    <p className="text-justify">
                      Le "double clic" du consommateur au titre du bon de commande constitue une signature électronique qui a, entre les parties, la même valeur qu'une signature manuscrite.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 6 : Confirmation de commande</h3>
                    <p className="text-justify">
                      Les informations contractuelles feront l'objet d'une confirmation au moment de la commande ou à défaut, à l'adresse indiquée par le consommateur au sein du bon de commande.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 7 : Preuve de la transaction</h3>
                    <p className="text-justify">
                      Les registres informatisés, conservés dans les systèmes informatiques de la société FRESH N'GOOD SARL dans des conditions raisonnables de sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les parties. L'archivage des bons de commande et des factures est effectué sur un support fiable et durable pouvant être produit à titre de preuve.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 8 : Informations sur les produits</h3>
                    <p className="text-justify mb-2">
                      8-a : La société présente sur son site web freshngood.ma les produits à vendre avec les caractéristiques nécessaires qui permettent au consommateur potentiel de connaître avant la prise de commande définitive les caractéristiques essentielles des produits qu'il souhaite acheter.
                    </p>
                    <p className="text-justify">
                      8-b : Les offres présentées par la société FRESH N'GOOD ne sont valables que dans la limite des stocks disponibles.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 9 : Prix</h3>
                    <p className="text-justify">
                      Les prix sont indiqués en Dirham marocain et ne sont valables qu'à la date de l'envoi du bon de commande par le consommateur. Ils ne tiennent pas compte des frais de livraison, facturés en supplément, et indiqués avant la validation de la commande. Les prix tiennent compte de la T.V.A. applicable au jour de la commande et tout changement du taux applicable T.V.A. sera automatiquement répercuté sur le prix des produits de la boutique en ligne. Le paiement de la totalité du prix doit être réalisé lors de la commande. A aucun moment, les sommes versées ne pourront être considérées comme des arrhes ou des acomptes.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 10 : Mode de paiement</h3>
                    <p className="text-justify mb-2">
                      Pour régler votre commande, vous choisissez le moyen de paiement parmi ceux proposés par freshngood.ma au niveau de la page de paiement. Dans ce cas, la remise de la transaction pour débit de votre compte est effectuée dans la journée qui suit la date de la confirmation de livraison.
                    </p>
                    <p className="text-justify mb-2">
                      Vos paiements Multi-canaux sont sécurisés par le Centre Monétique Interbancaire (CMI) qui offre un service de paiement entièrement sécurisé.
                    </p>
                    <p className="text-justify mb-2">
                      Le Consommateur garantit la Société FRESH N'GOOD qu'il dispose des autorisations éventuellement nécessaires pour utiliser le mode de paiement choisi par lui, lors de la validation du Bon de commande.
                    </p>
                    <p className="text-justify">
                      En cas de paiement par carte bancaire, les dispositions relatives à l'utilisation frauduleuse du moyen de paiement prévues dans les conventions conclues entre le Consommateur et l'émetteur de la carte entre la Société FRESH N'GOOD et son établissement bancaire s'appliquent.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 11 : Disponibilité des produits</h3>
                    <p className="text-justify">
                      La commande sera expédiée au plus tard dans un délai de 7 jours ouvrables à compter du jour suivant celui où le consommateur a effectué le paiement. En cas d'indisponibilité du produit commandé, notamment du fait de nos fournisseurs le consommateur aura alors le choix de demander soit le remboursement des sommes versées dans les 30 jours au plus tard de leur versement, soit l'échange du produit.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 12 : Modalités de livraison</h3>
                    <p className="text-justify">
                      Les produits sont livrés à l'adresse indiquée par le consommateur sur le bon de commande et uniquement au Maroc plus précisément à Marrakech. Le consommateur est tenu de vérifier l'état de l'emballage de la marchandise à la livraison et de signaler les dommages dûs au transporteur sur le bon de livraison, ainsi qu'à la société FRESH N'GOOD, dans un délai d'une semaine. En ce qui concerne l'expédition, dès que nous procédons à un envoi, vous recevez immédiatement un mail vous en informant.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 13 : Problèmes de livraison du fait du transporteur</h3>
                    <p className="text-justify">
                      Toute anomalie concernant la livraison (avarie, produit manquant par rapport au bon de livraison, colis endommagé, produits cassés…) devra être impérativement indiquée sur le bon de livraison sous forme de "réserves manuscrites", accompagnée de la signature du client. Le consommateur devra parallèlement confirmer cette anomalie en adressant au transporteur dans les deux (2) jours ouvrables suivants la date de livraison un courrier recommandé avec accusé de réception exposant les dites réclamations. Le consommateur devra transmettre copie de ce courrier par fax ou par simple courrier à : support@freshngood.ma Service Clients, Imm. Assala – 50 Gueliz, Bd Mohamed VI, Marrakesh 40000
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 14 : Erreurs de livraison</h3>
                    <p className="text-justify mb-2">
                      14-a : Le consommateur devra formuler auprès de la société FRESH N'GOOD le jour même de la livraison ou au plus tard le premier jour ouvré suivant la livraison, toute réclamation d'erreur de livraison et/ou de non conformité des produits en nature ou en qualité par rapport aux indications figurant sur le bon de commande. Toute réclamation formulée au delà de ce délai sera rejetée.
                    </p>
                    <p className="text-justify mb-2">
                      14-b : La formulation de cette réclamation auprès de la société FRESH N'GOOD pourra être faite:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-2">
                      <li>En priorité par e-mail sur support@freshngood.ma du mardi au Vendredi de 9h à 12h.</li>
                      <li>En vous connectant sur notre site dans la rubrique "suivez votre commande" où, après avoir entré votre numéro de client, vous pourrez nous poser votre question à travers le menu nous contacter en précisant bien la référence de la commande.</li>
                    </ul>
                    <p className="text-justify mb-2">
                      14-c : Toute réclamation non effectuée dans les règles définies ci-dessus et dans les délais impartis ne pourra être prise en compte et dégagera la société FRESH N'GOOD de toute responsabilité vis à vis du consommateur.
                    </p>
                    <p className="text-justify mb-2">
                      14-d : A réception de la réclamation, la société attribuera un numéro d'échange du ou des produit(s) concerné(s) et le communiquera par e-mail, par fax ou par téléphone au consommateur. L'échange d'un produit ne peut avoir lieu qu'après l'attribution au consommateur d'un numéro d'échange selon la démarche présentée ci-dessus.
                    </p>
                    <p className="text-justify">
                      14-e : En cas d'erreur de livraison ou d'échange, tout produit à échanger ou à rembourser devra être retourné à la société dans son ensemble et dans son emballage d'origine. Pour être accepté, tout retour devra être signalé au préalable à notre service client. Les frais d'envoi sont à la charge de la société FRESH N'GOOD, sauf dans le cas où il s'avérerait que le produit repris ne correspond pas à la déclaration d'origine faite par le consommateur dans le bon de retour.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 15 : Garantie des produits</h3>
                    <p className="text-justify">
                      Les dispositions des présentes ne peuvent priver le consommateur de la garantie légale qui oblige le vendeur professionnel à le garantir contre toutes les conséquences des vices cachés de la chose vendue. Le consommateur est expressément informé que la société FRESH N'GOOD SARL n'est pas le producteur des produits présentés dans le cadre du site web, relative à la responsabilité du fait des produits défectueux.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 16 : Droit de rétractation</h3>
                    <p className="text-justify mb-2">
                      Le consommateur dispose d'un délai de 1 jour pour retourner sa commande, à ses frais, les produits ne lui convenant pas. Ce délai court à compter du jour de la livraison de la commande du consommateur. Tout retour devra être signalé au préalable auprès du Service Client de FRESH N'GOOD SARL:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mb-2">
                      <li>En priorité par téléphone du Lundi au Vendredi de 9h à 12h,</li>
                      <li>En vous connectant sur notre site dans la rubrique "suivez votre commande" où, après avoir entré votre numéro de client, vous pourrez obtenir votre numéro de commande.</li>
                    </ul>
                    <p className="text-justify mb-2">
                      Le produit devra être retourné en Collier Recommandé à freshngood.ma Service Clients, Imm. Assala – 50 Gueliz, Bd Mohamed VI, Marrakesh 40000 Maroc
                    </p>
                    <p className="text-justify mb-2">
                      Les produits emballés ne devront pas avoir été descellés ou décongelés, afin que le consommateur puisse bénéficier du droit de rétractation. Seuls seront repris les produits renvoyés dans leur ensemble, dans leur emballage d'origine complet et intact, et en parfait état de revente. Tout produit qui aura été abîmé, décongelé, ou dont l'emballage d'origine aura été détérioré, ne sera ni remboursé ni échangé.
                    </p>
                    <p className="text-justify mb-2">
                      Ce droit de rétractation s'exerce sans pénalité, à l'exception des frais de retour. Dans l'hypothèse de l'exercice du droit de rétractation, le consommateur a le choix de demander soit le remboursement des sommes versées via un avoir qu'il pourra consommer sur le site freshngood.ma, soit l'échange du produit. Dans le cas d'un échange, la réexpédition se fera aux frais du consommateur.
                    </p>
                    <p className="text-justify">
                      En cas d'exercice du droit de rétractation, la société FRESH N'GOOD fera tous les efforts pour rembourser le consommateur dans un délai de 15 jours. Cependant, compte tenu du caractère technique des produits vendus, ce délai pourra être étendu à 45 jours. En cas de défaut d'exécution du contrat par un fournisseur résultant de l'indisponibilité du produit, du bien ou du service commandé, le consommateur doit être informé de cette indisponibilité et doit, le cas échéant, pouvoir être remboursé, dans les 30 jours au plus tard de leur versement. Au-delà de ce terme ces sommes sont productives d'intérêts au taux légal.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 17 : Force majeure</h3>
                    <p className="text-justify">
                      Aucune des deux parties n'aura failli à ses obligations contractuelles, dans la mesure où leur exécution sera retardée, entravée ou empêchée par un cas fortuit ou une force majeure. Sera considéré comme cas fortuit ou force majeure tous faits ou circonstances irrésistibles, extérieurs aux parties, imprévisibles, inévitables, indépendants de la volonté des parties et qui ne pourra être empêché par ces dernières, malgré tous les efforts raisonnablement possibles. La partie touchée par de telles circonstances en avisera l'autre dans les dix jours ouvrables suivant la date à laquelle elle en aura eu connaissance. Les deux parties se rapprocheront alors, dans un délai d'un mois, sauf impossibilité due au cas de force majeure, pour examiner l'incidence de l'événement et convenir des conditions dans lesquelles l'exécution du contrat sera poursuivie. Si le cas de force majeur a une durée supérieure à trois mois, les présentes conditions générales pourront être résiliées par la partie lésée. De façon expresse, sont considérés comme cas de force majeure ou cas fortuits, outre ceux habituellement retenus par la jurisprudence des cours et des tribunaux marocains : le blocage des moyens de transports ou d'approvisionnements, tremblements de terre, incendies, tempêtes, inondations, foudre ; l'arrêt des réseaux de télécommunication ou difficultés propres aux réseaux de télécommunication externes aux clients.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 18 : Non validation partielle</h3>
                    <p className="text-justify">
                      Si une ou plusieurs stipulations des présentes conditions générales sont tenues pour non valides ou déclarées telles en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 19 : Non renonciation</h3>
                    <p className="text-justify">
                      Le fait pour l'une des parties de ne pas se prévaloir d'un manquement par l'autre partie à l'une quelconque des obligations visées dans les présentes conditions générales ne saurait être interprété pour l'avenir comme une renonciation à l'obligation en cause.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 20 : Titre</h3>
                    <p className="text-justify">
                      En cas de difficulté d'interprétation entre l'un quelconque des titres figurant en tête des clauses, et l'une quelconque des clauses, les titres seront déclarés inexistants.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 21 : Loi applicable</h3>
                    <p className="text-justify">
                      Les présentes conditions générales sont soumises à la loi Marocaine. Il en est ainsi pour les règles de fonds comme pour les règles de forme. En cas de litige ou de réclamation, le consommateur s'adressera en priorité au service client du site internet freshngood.ma pour obtenir une solution amiable. Dans un second temps et en cas de recours, le consommateur pourra déposer une réclamation auprès de, via sa boîte de dialogue dédiée.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Article 23 : Informatique et Libertés</h3>
                    <p className="text-justify">
                      Les informations qui sont demandées au consommateur sont nécessaires au traitement de sa commande et pourront être communiquées aux partenaires de la société FRESH N'GOOD SARL. Le consommateur peut écrire à la société FRESH N'GOOD dont les coordonnées sont au sein de la charte de confidentialité figurant dans le cadre du site web, pour s'opposer à une telle communication, ou pour exercer ses droits d'accès, de rectification à l'égard des informations le concernant et figurant dans les fichiers de la société FRESH N'GOOD dans les conditions prévues par la loi.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-ocean mb-3">Conditions d'utilisation des services CMI</h3>
                    <p className="text-justify mb-2">
                      Les données enregistrées par CMI S.A sur la plate-forme CMI pour le compte de freshngood.ma constituent la preuve de l'ensemble des transactions commerciales passées entre vous et la société FRESH N'GOOD SARL.
                    </p>
                    <p className="text-justify mb-2">
                      Les conditions générales de vente suivantes régissent l'ensemble des transactions établies sur le catalogue web de freshngood.ma Toute commande passée sur ce site suppose du client son acceptation inconditionnelle et irrévocable de ces conditions.
                    </p>
                    <p className="text-justify mb-2">
                      Le présent contrat est un contrat à distance qui a pour objet de définir les droits et obligations des parties dans le cadre de la vente des produits de la société FRESH N'GOOD, sur Internet, par l'intermédiaire de la plate-forme CMI.
                    </p>
                    <p className="text-justify mb-2">
                      CMI est un service de gestion des transactions et une marque déposée par CMI S.A.
                    </p>
                    <p className="text-justify mb-2">
                      Pour régler votre commande par carte bancaire, vous choisissez le moyen de paiement parmi ceux proposés par freshngood.ma au niveau du Bon de commande (Visa, MasterCard, Maestro, cmi, Maestro, Diners Club et Discover).
                    </p>
                    <p className="text-justify mb-2">
                      Dans ce cas, la remise de la transaction pour débit de votre compte est effectuée dans la journée qui suit la date de la confirmation de livraison.
                    </p>
                    <p className="text-justify mb-2">
                      Votre paiement par carte bancaire est sécurisé par CMI qui offre un service de paiement entièrement sécurisé.
                    </p>
                    <p className="text-justify mb-2">
                      Le Consommateur garantit la Société FRESH N'GOOD SARL qu'il dispose des autorisations éventuellement nécessaires pour utiliser le mode de paiement choisi par lui, lors de la validation du Bon de commande.
                    </p>
                    <p className="text-justify">
                      En cas de paiement par carte bancaire, les dispositions relatives à l'utilisation frauduleuse du moyen de paiement prévues dans les conventions conclues entre le Consommateur et l'émetteur de la carte entre la Société et son établissement bancaire s'appliquent.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-lg">
            <CardHeader className="bg-seafoam text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Informations de Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
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
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-ocean/10 rounded-full">
                    <Phone className="h-6 w-6 text-ocean" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ocean">Téléphone</h4>
                    <p className="text-gray-600">0608 611 511</p>
                    <p className="text-gray-600">0608 411 511</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-ocean/10 rounded-full">
                    <Mail className="h-6 w-6 text-ocean" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ocean">Email</h4>
                    <p className="text-gray-600">support@freshngood.ma</p>
                    <p className="text-gray-600">contact@freshngood.ma</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}