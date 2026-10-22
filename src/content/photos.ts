/**
 * Photos d'ambiance (licence Unsplash : usage commercial libre, sans attribution obligatoire).
 * Elles illustrent Jérusalem en général et ne prétendent pas montrer un lieu précis.
 */
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const u = (id: string, alt: string, width = 2400, height = 1600): Photo => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`,
  alt,
  width,
  height,
});

export const PHOTOS = {
  hero: u("1767873806373-8004ffdc35ca", "Remparts de la Vieille Ville de Jérusalem dominant la ville sous un ciel bleu", 2560, 1600),
  dusk: u("1686509178296-b5ae1a9750a3", "Remparts de Jérusalem à la tombée de la nuit", 2560, 1440),
  walls: u("1529079688486-feaa9f516c9a", "Murailles en pierre de Jérusalem baignées de soleil"),
  alley: u("1747571855501-12fec848bdb0", "Ruelle pavée en pierre de Jérusalem"),
  street: u("1700162336002-6f0e519d3b35", "Rue étroite bordée d’arbres et de maisons en pierre"),
  stoneStreet: u("1697747131953-4d19305d70b0", "Mur en pierre de Jérusalem le long d’un trottoir"),
  colonnade: u("1663856450903-8a23b8fe07bf", "Passage en pierre à colonnes"),
  market: u("1664997432214-fdd64ab20491", "Étals animés d’un marché de Jérusalem"),
  tram: u("1675078837773-ddb8e9a4cf5f", "Le tramway de Jérusalem en centre-ville"),
  hills: u("1678133987650-75a5856da227", "Vue sur les collines et les quartiers de Jérusalem"),
  park: u("1686509179245-2e8ebafb1fb4", "Promenade arborée au pied des remparts"),
  rooftops: u("1686509178365-19b2d22c500d", "Vue sur les toits de Jérusalem"),
  stairs: u("1556861321-b7a1e5b1c291", "Escaliers en pierre ancienne"),
  greenDoor: u("1606385838720-5ff10ab1d32b", "Façade en pierre avec porte verte"),
  panorama: u("1587297069400-6cc5da81658a", "Panorama aérien de Jérusalem"),
  interiorLiving: u("1741764014072-68953e93cd48", "Séjour lumineux avec cuisine ouverte"),
  interiorWindows: u("1757924461488-ef9ad0670978", "Salon avec grandes baies vitrées"),
} as const satisfies Record<string, Photo>;

/** Intérieurs utilisés par les annonces de démonstration. */
export const INTERIOR_IDS = [
  "1741764014072-68953e93cd48",
  "1757924461488-ef9ad0670978",
  "1738168246881-40f35f8aba0a",
  "1738168279272-c08d6dd22002",
  "1680416124510-5eae1beca412",
  "1512914890251-2f96a9b0bbe2",
  "1713832139688-79676097edde",
  "1758448755952-42b404bc6f39",
  "1628592102751-ba83b0314276",
  "1663811397207-418a92396ad5",
  "1638454668466-e8dbd5462f20",
  "1715985160053-d339e8b6eb94",
] as const;
