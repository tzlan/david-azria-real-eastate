export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  name: "King David Immobilier",
  nameHe: "קינג דוד נדל״ן",
  agentName: "David Azria",
  /** WhatsApp pro de David. */
  phone: process.env.NEXT_PUBLIC_AGENT_PHONE ?? "+972 58-426-3914",
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/profile.php?id=61577646827725",
  locale: "fr_FR",
  description:
    "King David Immobilier, l’agence francophone de David Azria à Jérusalem. Appartements à vendre et à louer à Rehavia, Talbieh, German Colony, Baka, Katamon… Accompagnement complet, de la recherche à la signature.",
} as const;

export const absoluteUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** "+972 58-426-3914" → "972584263914" */
export const phoneDigits = (): string => SITE.phone.replace(/\D/g, "");

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${phoneDigits()}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const telUrl = (): string => `tel:+${phoneDigits()}`;
