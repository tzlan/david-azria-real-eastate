import { PHOTOS, type Photo } from "./photos";

export interface GuideSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][]; caption: string };
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  short: string;
  photo: Photo;
  updated: string;
  readingMinutes: number;
  sections: GuideSection[];
  sources?: { label: string; url: string }[];
}

export const GUIDES_ARTICLES: Guide[] = [
  {
    slug: "acheter-appartement-jerusalem",
    short: "Acheter à Jérusalem",
    kicker: "Acheter",
    title: "Acheter un appartement à Jérusalem : le guide complet",
    description: "Les étapes d’un achat immobilier à Jérusalem quand on est francophone : budget, recherche, avocat, zikhron dvarim, contrat, enregistrement au Tabou.",
    photo: PHOTOS.walls,
    updated: "2026-10-23",
    readingMinutes: 7,
    sections: [
      {
        title: "1. Définir son projet et son budget",
        paragraphs: [
          "Avant toute visite, fixez trois choses : le quartier (ou deux ou trois quartiers cibles), le nombre de pièces et le budget global, frais compris. À Jérusalem, les frais d’acquisition (taxe d’achat, avocat, agence, expertise) s’ajoutent au prix et doivent être anticipés dès le départ.",
          "Si vous financez par un crédit israélien (machkanta), obtenez un accord de principe de la banque : il vous permettra de faire une offre sérieuse rapidement, car les bons biens partent vite.",
        ],
      },
      {
        title: "2. La recherche et les visites",
        paragraphs: [
          "Le marché de Jérusalem est très hétérogène d’une rue à l’autre. Un agent local connaît l’état réel des immeubles, l’orientation, le bruit, la présence d’un mamad (pièce sécurisée) ou d’un ascenseur de Chabbat, autant de critères qui pèsent sur la valeur.",
        ],
        list: [
          "Vérifiez la surface réelle (les annonces israéliennes incluent parfois balcons et parties communes).",
          "Demandez s’il existe un mamad, un parking enregistré et un débarras.",
          "Visitez à différents moments de la journée.",
        ],
      },
      {
        title: "3. L’offre et l’avocat",
        paragraphs: [
          "En Israël, l’avocat est au cœur de la transaction. Dès que le prix est négocié, il vérifie l’extrait du registre foncier (Tabou), les hypothèques, les permis de construire et d’éventuelles constructions non autorisées.",
          "Évitez de signer un « zikhron dvarim » (mémorandum d’accord) sans avocat : même rédigé en quelques lignes, il peut être juridiquement contraignant.",
        ],
      },
      {
        title: "4. Le contrat et les paiements",
        paragraphs: [
          "Le contrat de vente fixe un échéancier de paiements. L’avocat inscrit une note d’avertissement (heara ’azhara) au registre foncier pour protéger l’acheteur dès la signature.",
          "La taxe d’achat (mas rechisha) doit être déclarée et payée auprès de l’Autorité fiscale dans les délais légaux suivant la signature.",
        ],
      },
      {
        title: "5. Remise des clés et enregistrement",
        paragraphs: [
          "Une fois le solde réglé, les clés sont remises et l’avocat procède à l’enregistrement du bien à votre nom au Tabou. Pensez à transférer l’arnona (taxe municipale), l’eau, l’électricité et le vaad bayit (charges de copropriété).",
        ],
      },
    ],
  },
  {
    slug: "frais-achat-immobilier-israel",
    short: "Frais d’achat en Israël",
    kicker: "Budget",
    title: "Frais d’achat immobilier en Israël : combien prévoir ?",
    description: "Taxe d’achat (mas rechisha), avocat, agence, expert, courtier : la liste des frais à prévoir pour acheter un appartement à Jérusalem.",
    photo: PHOTOS.stoneStreet,
    updated: "2026-10-23",
    readingMinutes: 5,
    sections: [
      {
        title: "Les frais à prévoir en plus du prix",
        table: {
          caption: "Frais usuels lors d’un achat dans l’ancien (indicatif)",
          head: ["Poste", "Montant usuel"],
          rows: [
            ["Agence immobilière", "2 % du prix + TVA"],
            ["Avocat de l’acheteur", "0,5 % à 1,5 % du prix + TVA"],
            ["Expert (shamai)", "1 000 à 6 000 ₪ + TVA"],
            ["Courtier en crédit (optionnel)", "1 % à 1,25 % du prêt + TVA"],
            ["Taxe d’achat (mas rechisha)", "Selon barème, voir ci-dessous"],
          ],
        },
      },
      {
        title: "La taxe d’achat (mas rechisha)",
        paragraphs: [
          "C’est le poste le plus important. Pour l’achat d’une résidence unique par un résident israélien, le barème est progressif : la première tranche est exonérée, puis les taux montent par paliers jusqu’à 8 % puis 10 % pour les biens les plus chers.",
          "Pour un appartement supplémentaire ou pour un acheteur non résident, le taux part de 8 % dès le premier shekel, puis 10 % au-delà d’un certain seuil.",
          "Les seuils sont indexés chaque année. Avant toute décision, faites une simulation sur le calculateur officiel de l’Autorité fiscale ou demandez à votre avocat.",
        ],
      },
      {
        title: "Exemple de budget",
        paragraphs: [
          "Pour un appartement de 3 000 000 ₪ acheté comme résidence unique, comptez en ordre de grandeur 2 % + TVA d’agence, environ 1 % + TVA d’avocat, quelques milliers de shekels d’expertise, plus la taxe d’achat calculée selon le barème en vigueur.",
        ],
      },
    ],
    sources: [
      { label: "Buy It In Israel : frais de clôture", url: "https://www.buyitinisrael.com/?p=18925" },
      { label: "Global Law Experts : taxes immobilières en Israël", url: "https://globallawexperts.com/israel-real-estate-taxes-2026/" },
    ],
  },
  {
    slug: "alyah-achat-immobilier",
    short: "Alyah et immobilier",
    kicker: "Alyah",
    title: "Alyah et achat immobilier : les avantages pour les olim",
    description: "Taxe d’achat réduite pour les olim hadashim : fenêtre d’éligibilité, barème, conditions. Ce qu’il faut savoir avant d’acheter à Jérusalem.",
    photo: PHOTOS.panorama,
    updated: "2026-10-23",
    readingMinutes: 4,
    sections: [
      {
        title: "Une taxe d’achat très réduite",
        paragraphs: [
          "Les nouveaux immigrants (olim hadashim) bénéficient d’un barème de taxe d’achat avantageux sur un bien résidentiel. Depuis la réforme entrée en vigueur le 15 août 2024, la fenêtre d’éligibilité court d’un an avant l’alyah à sept ans après.",
        ],
        table: {
          caption: "Barème olim (nouvelles règles, montants indexés chaque année)",
          head: ["Tranche de prix", "Taux"],
          rows: [
            ["Jusqu’à 1 978 745 ₪", "0 %"],
            ["De 1 978 745 à 6 055 070 ₪", "0,5 %"],
            ["De 6 055 070 à 20 183 565 ₪", "8 %"],
          ],
        },
      },
      {
        title: "Les conditions à connaître",
        list: [
          "L’avantage ne s’applique qu’à un seul bien.",
          "Le bien peut être un investissement que l’oleh n’habite pas.",
          "Le service militaire ne compte pas dans la fenêtre de sept ans.",
          "Au-delà de 20 183 565 ₪, l’avantage ne s’applique pas.",
        ],
      },
      {
        title: "Notre conseil",
        paragraphs: [
          "Planifiez l’achat en fonction de votre date d’alyah : l’économie peut représenter plusieurs dizaines de milliers de shekels. Faites valider votre éligibilité par un avocat avant de signer.",
        ],
      },
    ],
    sources: [{ label: "Nefesh B’Nefesh : Planning your Aliyah, purchase tax", url: "https://www.nbn.org.il/aliyahpedia/government-services/taxes-in-israel-and-overseas/planning-your-aliyah-purchase-tax/" }],
  },
  {
    slug: "comprendre-pieces-israel",
    short: "Lire une annonce israélienne",
    kicker: "Lexique",
    title: "3,5 pièces, mamad, soukka : comprendre une annonce israélienne",
    description: "Comment on compte les pièces en Israël, ce qu’est un mamad, un balcon soukka ou un ascenseur de Chabbat. Le lexique pour lire les annonces à Jérusalem.",
    photo: PHOTOS.interiorLiving,
    updated: "2026-10-23",
    readingMinutes: 4,
    sections: [
      {
        title: "Le nombre de pièces (hadarim)",
        paragraphs: [
          "En Israël, on compte le salon comme une pièce. Un « 4 pièces » correspond donc à un salon et trois chambres. Le « demi » (3,5 pièces) désigne une petite pièce supplémentaire : bureau, chambre d’enfant ou coin repas fermé.",
        ],
      },
      {
        title: "Le lexique essentiel",
        table: {
          caption: "Termes fréquents dans les annonces",
          head: ["Terme", "Signification"],
          rows: [
            ["Mamad (ממ״ד)", "Pièce sécurisée en béton armé, souvent utilisée comme chambre"],
            ["Mirpeset soukka", "Balcon à ciel ouvert permettant de construire une soukka"],
            ["Ascenseur de Chabbat", "Ascenseur s’arrêtant automatiquement à chaque étage pendant Chabbat"],
            ["Machsan", "Débarras privatif"],
            ["Dirat gan", "Rez-de-jardin"],
            ["Arnona", "Taxe municipale payée par l’occupant"],
            ["Vaad bayit", "Charges de copropriété"],
          ],
        },
      },
    ],
  },
  {
    slug: "louer-appartement-jerusalem",
    short: "Louer à Jérusalem",
    kicker: "Location",
    title: "Louer un appartement à Jérusalem : mode d’emploi",
    description: "Bail, garanties, arnona, durée : tout savoir pour louer un appartement à Jérusalem en tant que francophone.",
    photo: PHOTOS.alley,
    updated: "2026-10-23",
    readingMinutes: 4,
    sections: [
      {
        title: "Le bail",
        paragraphs: [
          "Les baux sont généralement signés pour un an, avec option de renouvellement. Lisez attentivement les clauses de sortie anticipée, d’indexation du loyer et de travaux.",
        ],
      },
      {
        title: "Les garanties demandées",
        list: [
          "Chèques post-datés pour les loyers.",
          "Garantie bancaire ou chèque de garantie.",
          "Parfois un ou deux garants (arevim).",
        ],
      },
      {
        title: "Les charges du locataire",
        paragraphs: [
          "Le locataire paie généralement l’arnona, l’eau, l’électricité, le gaz et le vaad bayit. Faites préciser leur montant avant de signer pour connaître le coût réel mensuel.",
        ],
      },
    ],
  },
  {
    slug: "quel-quartier-choisir-jerusalem",
    short: "Quel quartier choisir ?",
    kicker: "Quartiers",
    title: "Quel quartier choisir à Jérusalem quand on est francophone ?",
    description: "Katamon, Baka, German Colony, Rehavia, Ramat Eshkol, Har Nof… Le comparatif des quartiers de Jérusalem pour les familles francophones.",
    photo: PHOTOS.rooftops,
    updated: "2026-10-23",
    readingMinutes: 5,
    sections: [
      {
        title: "Au sud : la vie de famille francophone",
        paragraphs: [
          "Old Katamon, Baka et la German Colony forment le triangle francophone de Jérusalem : synagogues, écoles, commerces et le parc HaMesila qui les relie à pied.",
        ],
      },
      {
        title: "Au centre : vivre à pied",
        paragraphs: [
          "Rehavia, Talbieh et Kiryat Shmuel offrent le meilleur de la ville à pied, dans des immeubles anciens de caractère. Yemin Moshe et Mamilla visent une clientèle de prestige.",
        ],
      },
      {
        title: "Au nord et à l’ouest : espace et communauté",
        paragraphs: [
          "Ramat Eshkol, Maalot Dafna et Har Nof accueillent des communautés religieuses francophones et anglophones, avec des appartements souvent plus grands à budget équivalent.",
        ],
      },
    ],
  },
];

const BY_SLUG = new Map(GUIDES_ARTICLES.map((g) => [g.slug, g]));
export const getArticle = (slug: string): Guide | undefined => BY_SLUG.get(slug);
