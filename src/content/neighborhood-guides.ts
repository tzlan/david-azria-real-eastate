import type { NeighborhoodSlug } from "@/lib/neighborhoods";
import { PHOTOS, type Photo } from "./photos";

export interface NeighborhoodGuide {
  slug: NeighborhoodSlug;
  tagline: string;
  intro: string[];
  highlights: string[];
  idealFor: string[];
  photo: Photo;
}

/**
 * Guides de quartier : contenu éditorial unique par page (cœur du SEO local).
 * Rédigés de façon qualitative, sans chiffres de prix qui se périment.
 */
export const GUIDES: NeighborhoodGuide[] = [
  {
    slug: "rehavia",
    tagline: "La cité-jardin du centre de Jérusalem.",
    intro: [
      "Conçu dans les années 1920 et 1930 sur le modèle des cités-jardins européennes, Rehavia reste l’un des quartiers les plus recherchés de Jérusalem. Ses rues ombragées, ses immeubles Bauhaus en pierre et ses jardins intérieurs lui donnent un calme rare à quelques minutes à pied du centre-ville.",
      "On y vit à pied : cafés de la rue Azza, parc Rehavia, accès direct au centre et à Talbieh. L’offre est principalement composée d’appartements anciens rénovés, très prisés et rarement disponibles longtemps.",
    ],
    highlights: ["Architecture Bauhaus en pierre", "Tout à pied : centre-ville, Talbieh, German Colony", "Rues calmes et arborées", "Biens rares, forte demande"],
    idealFor: ["Couples et retraités qui veulent vivre à pied", "Investisseurs patrimoniaux", "Pied-à-terre à Jérusalem"],
    photo: PHOTOS.street,
  },
  {
    slug: "talbieh",
    tagline: "Villas historiques et adresses de prestige.",
    intro: [
      "Talbieh concentre certaines des plus belles adresses de Jérusalem : villas des années 1930, résidences de standing et institutions culturelles comme le Théâtre de Jérusalem. La résidence du Président de l’État se trouve à proximité.",
      "Le quartier attire une clientèle internationale qui recherche le prestige, la sécurité et la proximité immédiate de Rehavia, de la German Colony et de la Vieille Ville.",
    ],
    highlights: ["Villas et penthouses d’exception", "Théâtre de Jérusalem et vie culturelle", "Proximité de la Vieille Ville", "Clientèle internationale"],
    idealFor: ["Acheteurs haut de gamme", "Résidence secondaire de prestige", "Familles recherchant le calme"],
    photo: PHOTOS.greenDoor,
  },
  {
    slug: "german-colony",
    tagline: "Le charme des maisons templières et de la rue Emek Refaim.",
    intro: [
      "Fondée au XIXᵉ siècle par les Templiers allemands, la German Colony (Moshava Germanit) a gardé ses maisons en pierre aux toits de tuiles et ses jardins. La rue Emek Refaim, bordée de cafés, restaurants et boutiques, en est le cœur battant.",
      "Le parc HaMesila, aménagé sur l’ancienne voie ferrée, relie le quartier à Baka et à Katamon par une longue promenade piétonne et cyclable, très appréciée des familles.",
    ],
    highlights: ["Maisons templières du XIXᵉ siècle", "Cafés et commerces d’Emek Refaim", "Parc HaMesila (ancienne voie ferrée)", "Forte communauté francophone et anglophone"],
    idealFor: ["Familles", "Olim francophones", "Amateurs de vie de quartier"],
    photo: PHOTOS.park,
  },
  {
    slug: "baka",
    tagline: "Vie de famille, jardins et communauté francophone.",
    intro: [
      "Baka mêle maisons arabes anciennes à hauts plafonds et immeubles plus récents. Le quartier est résidentiel, vivant et très familial, avec de nombreuses synagogues, écoles et commerces de proximité.",
      "Sa communauté francophone est l’une des plus importantes de Jérusalem. Le parc HaMesila le relie à pied à la German Colony et à Katamon.",
    ],
    highlights: ["Maisons anciennes et rez-de-jardin", "Ambiance familiale", "Communauté francophone très présente", "Accès au parc HaMesila"],
    idealFor: ["Familles avec enfants", "Olim de France", "Acheteurs cherchant un jardin"],
    photo: PHOTOS.stoneStreet,
  },
  {
    slug: "old-katamon",
    tagline: "Le cœur francophone de Jérusalem.",
    intro: [
      "Old Katamon (Gonen) est réputé pour ses villas en pierre des années 1920-1930, ses rues calmes et sa vie communautaire intense. De nombreuses familles francophones s’y sont installées, avec synagogues, écoles et commerces adaptés.",
      "Entre Rehavia, la German Colony et le parc HaMesila, le quartier offre un excellent équilibre entre calme résidentiel et proximité du centre.",
    ],
    highlights: ["Villas en pierre historiques", "Très forte communauté francophone", "Nombreuses synagogues et écoles", "Proche du centre et du parc HaMesila"],
    idealFor: ["Familles francophones", "Olim", "Acheteurs recherchant la vie communautaire"],
    photo: PHOTOS.alley,
  },
  {
    slug: "yemin-moshe",
    tagline: "Face aux remparts de la Vieille Ville.",
    intro: [
      "Construit à partir de 1860 avec Mishkenot Sha’ananim, premier quartier juif bâti hors des murailles, Yemin Moshe est dominé par le célèbre moulin de Montefiore. Ses ruelles en escaliers, entièrement piétonnes, offrent des vues spectaculaires sur les remparts.",
      "Les biens y sont rares et souvent exceptionnels : maisons de caractère, terrasses panoramiques, calme absolu à deux pas de Mamilla et de la porte de Jaffa.",
    ],
    highlights: ["Vue sur les remparts de la Vieille Ville", "Ruelles piétonnes en pierre", "Moulin de Montefiore", "Biens d’exception, très rares"],
    idealFor: ["Résidence de prestige", "Amoureux de l’histoire", "Pied-à-terre d’exception"],
    photo: PHOTOS.stairs,
  },
  {
    slug: "mamilla",
    tagline: "Luxe contemporain à la porte de Jaffa.",
    intro: [
      "Mamilla associe résidences de luxe récentes, hôtels de grand standing et l’Alrov Mamilla Avenue, rue commerçante piétonne qui mène directement à la porte de Jaffa.",
      "Services de conciergerie, parkings, sécurité : c’est l’adresse idéale pour ceux qui veulent un appartement clé en main au cœur absolu de Jérusalem.",
    ],
    highlights: ["Résidences de luxe avec services", "Avenue piétonne Mamilla", "Porte de Jaffa à pied", "Idéal pied-à-terre"],
    idealFor: ["Résidence secondaire", "Clientèle internationale", "Investissement locatif haut de gamme"],
    photo: PHOTOS.colonnade,
  },
  {
    slug: "nachlaot",
    tagline: "Cours intérieures, ruelles et shouk Mahane Yehuda.",
    intro: [
      "Nachlaot est un ensemble de petits quartiers fondés à la fin du XIXᵉ siècle, aux ruelles étroites et cours intérieures pleines de charme. Il jouxte le marché Mahane Yehuda, le shouk le plus vivant de la ville.",
      "Ambiance bohème, nombreuses petites synagogues, population jeune et artistique : idéal pour vivre Jérusalem de l’intérieur. Les appartements sont souvent petits mais pleins de cachet.",
    ],
    highlights: ["Shouk Mahane Yehuda à pied", "Ruelles et cours intérieures", "Ambiance jeune et créative", "Fort potentiel locatif"],
    idealFor: ["Étudiants et jeunes actifs", "Investissement locatif", "Amateurs de charme ancien"],
    photo: PHOTOS.market,
  },
  {
    slug: "centre-ville",
    tagline: "Au rythme de Ben Yehuda et du tramway.",
    intro: [
      "Le centre-ville, autour de la rue Jaffa, de Ben Yehuda et de la place de Sion, est le cœur commerçant de Jérusalem. Le tramway le traverse et le relie à toute la ville.",
      "On y trouve des appartements anciens à rénover comme des programmes neufs, avec une forte demande locative de la part des étudiants et des jeunes actifs.",
    ],
    highlights: ["Tramway et transports", "Commerces, restaurants, vie nocturne", "Programmes neufs et anciens", "Demande locative soutenue"],
    idealFor: ["Investisseurs", "Jeunes actifs", "Pied-à-terre pratique"],
    photo: PHOTOS.tram,
  },
  {
    slug: "kiryat-shmuel",
    tagline: "Un îlot paisible entre Rehavia et Talbieh.",
    intro: [
      "Petit quartier résidentiel blotti entre Rehavia, Talbieh et Katamon, Kiryat Shmuel est apprécié pour son calme, ses immeubles de taille humaine et sa situation centrale.",
      "On y profite de la proximité de tous les services du centre sans en subir l’agitation.",
    ],
    highlights: ["Très central et très calme", "Immeubles de taille humaine", "Proche Rehavia et Talbieh"],
    idealFor: ["Couples", "Familles", "Retraités"],
    photo: PHOTOS.walls,
  },
  {
    slug: "arnona",
    tagline: "Calme, verdure et immeubles récents au sud de la ville.",
    intro: [
      "Arnona est un quartier résidentiel du sud de Jérusalem, prisé pour ses immeubles plus récents, ses appartements spacieux et ses vues dégagées. L’ambassade des États-Unis s’y est installée en 2018.",
      "Proche de la promenade Haas et de Talpiot, le quartier offre souvent plus d’espace, de mamad et de parkings que le centre historique.",
    ],
    highlights: ["Immeubles récents avec mamad et parking", "Appartements plus spacieux", "Vues dégagées", "Quartier calme et familial"],
    idealFor: ["Familles", "Acheteurs cherchant du neuf", "Budget plus maîtrisé que le centre"],
    photo: PHOTOS.hills,
  },
  {
    slug: "ramat-eshkol",
    tagline: "Communautés francophones et anglophones au nord.",
    intro: [
      "Ramat Eshkol et Maalot Dafna, construits après 1967, accueillent de nombreuses familles religieuses francophones et anglophones. Le quartier est bien desservi par le tramway.",
      "Synagogues, écoles et commerces de proximité en font un lieu de vie très communautaire, avec des prix souvent plus accessibles qu’au sud de la ville.",
    ],
    highlights: ["Vie communautaire riche", "Tramway à proximité", "Écoles et synagogues", "Prix plus accessibles"],
    idealFor: ["Familles religieuses", "Olim", "Premier achat"],
    photo: PHOTOS.rooftops,
  },
  {
    slug: "french-hill",
    tagline: "Vues panoramiques près du Mont Scopus.",
    intro: [
      "French Hill (Givat Hatsarfatit) s’étend au nord-est de la ville, près du campus de l’Université hébraïque du Mont Scopus et de l’hôpital Hadassah. Le tramway le relie au centre.",
      "Le quartier séduit les universitaires, les étudiants et les familles qui recherchent espace et vues, avec un bon potentiel locatif.",
    ],
    highlights: ["Proche Université hébraïque", "Tramway", "Vues panoramiques", "Potentiel locatif étudiant"],
    idealFor: ["Universitaires", "Investissement locatif", "Familles"],
    photo: PHOTOS.panorama,
  },
  {
    slug: "har-nof",
    tagline: "Quartier religieux à flanc de colline.",
    intro: [
      "Har Nof, à l’extrémité ouest de Jérusalem, est un quartier majoritairement religieux bâti à flanc de colline, avec des vues remarquables sur les forêts de Jérusalem.",
      "Vie communautaire forte, nombreuses institutions et une importante communauté francophone et anglophone.",
    ],
    highlights: ["Vues sur les collines", "Communauté religieuse", "Institutions et écoles", "Grands appartements familiaux"],
    idealFor: ["Familles religieuses", "Olim", "Grands logements"],
    photo: PHOTOS.hills,
  },
];

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
export const getGuide = (slug: NeighborhoodSlug): NeighborhoodGuide | undefined => BY_SLUG.get(slug);
