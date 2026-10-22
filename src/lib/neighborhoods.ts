/**
 * Quartiers de Jérusalem. Le slug est la clé stable (URL + extraction IA).
 * Coordonnées = centroïde approximatif : la carte montre une zone, jamais l'adresse exacte.
 */
export const NEIGHBORHOODS = {
  rehavia: { name: "Rehavia", lat: 31.7735, lng: 35.212 },
  talbieh: { name: "Talbieh", lat: 31.77, lng: 35.219 },
  "kiryat-shmuel": { name: "Kiryat Shmuel", lat: 31.771, lng: 35.213 },
  "german-colony": { name: "German Colony", lat: 31.762, lng: 35.22 },
  "old-katamon": { name: "Old Katamon", lat: 31.762, lng: 35.212 },
  katamonim: { name: "Katamonim", lat: 31.757, lng: 35.205 },
  baka: { name: "Baka", lat: 31.755, lng: 35.223 },
  arnona: { name: "Arnona", lat: 31.746, lng: 35.225 },
  talpiot: { name: "Talpiot", lat: 31.75, lng: 35.215 },
  "armon-hanatziv": { name: "Armon Hanatziv", lat: 31.752, lng: 35.238 },
  "abu-tor": { name: "Abu Tor", lat: 31.765, lng: 35.23 },
  "yemin-moshe": { name: "Yemin Moshe", lat: 31.772, lng: 35.2255 },
  mamilla: { name: "Mamilla", lat: 31.7775, lng: 35.2245 },
  "centre-ville": { name: "Centre-ville", lat: 31.781, lng: 35.217 },
  nachlaot: { name: "Nachlaot", lat: 31.784, lng: 35.21 },
  "shaarei-hessed": { name: "Shaarei Hessed", lat: 31.776, lng: 35.209 },
  musrara: { name: "Musrara", lat: 31.783, lng: 35.227 },
  rassco: { name: "Rassco", lat: 31.766, lng: 35.205 },
  "givat-mordechai": { name: "Givat Mordechai", lat: 31.768, lng: 35.196 },
  "bayit-vegan": { name: "Bayit Vegan", lat: 31.77, lng: 35.18 },
  "beit-hakerem": { name: "Beit Hakerem", lat: 31.78, lng: 35.188 },
  "kiryat-moshe": { name: "Kiryat Moshe", lat: 31.786, lng: 35.195 },
  "givat-shaul": { name: "Givat Shaul", lat: 31.79, lng: 35.19 },
  "har-nof": { name: "Har Nof", lat: 31.785, lng: 35.175 },
  romema: { name: "Romema", lat: 31.792, lng: 35.203 },
  "kiryat-yovel": { name: "Kiryat Yovel", lat: 31.76, lng: 35.175 },
  malha: { name: "Malha", lat: 31.75, lng: 35.19 },
  gilo: { name: "Gilo", lat: 31.73, lng: 35.185 },
  "ein-kerem": { name: "Ein Kerem", lat: 31.768, lng: 35.16 },
  "ramat-eshkol": { name: "Ramat Eshkol", lat: 31.802, lng: 35.225 },
  "maalot-dafna": { name: "Maalot Dafna", lat: 31.796, lng: 35.229 },
  "french-hill": { name: "French Hill", lat: 31.802, lng: 35.238 },
  "pisgat-zeev": { name: "Pisgat Zeev", lat: 31.825, lng: 35.245 },
  ramot: { name: "Ramot", lat: 31.815, lng: 35.195 },
  jerusalem: { name: "Jérusalem", lat: 31.7767, lng: 35.2134 },
} as const satisfies Record<string, { name: string; lat: number; lng: number }>;

export type NeighborhoodSlug = keyof typeof NEIGHBORHOODS;

export const NEIGHBORHOOD_SLUGS = Object.keys(NEIGHBORHOODS) as [NeighborhoodSlug, ...NeighborhoodSlug[]];

export function neighborhoodName(slug: NeighborhoodSlug): string {
  return NEIGHBORHOODS[slug].name;
}
