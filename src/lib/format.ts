import type { Listing, ListingStatus } from "./types";
import { PROPERTY_TYPES } from "./types";
import { neighborhoodName } from "./neighborhoods";

const priceFmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });
const numFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jerusalem" });

export function formatPrice(l: Pick<Listing, "price" | "transaction">): string {
  if (l.price === null) return "Prix sur demande";
  return l.transaction === "rent" ? `${priceFmt.format(l.price)} / mois` : priceFmt.format(l.price);
}

/** Libellé court pour les pins de carte : "4,65 M₪", "7,8 k₪". */
export function formatPriceShort(l: Pick<Listing, "price">): string {
  if (l.price === null) return "Sur demande";
  if (l.price >= 1_000_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(l.price / 1_000_000)} M₪`;
  if (l.price >= 1_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(l.price / 1_000)} k₪`;
  return `${l.price} ₪`;
}

export const formatNumber =(n: number): string => numFmt.format(n);
export const formatDate = (iso: string): string => dateFmt.format(new Date(iso));

export function formatRooms(rooms: number): string {
  return `${formatNumber(rooms)} pièce${rooms > 1 ? "s" : ""}`;
}

export function formatFloor(floor: number, total: number | null): string {
  const label = floor === 0 ? "Rez-de-chaussée" : floor < 0 ? `Niveau ${floor}` : `${floor}${floor === 1 ? "er" : "e"} étage`;
  return total ? `${label} sur ${total}` : label;
}

export const STATUS_LABEL: Record<ListingStatus, string> = {
  available: "Disponible",
  "under-offer": "Sous offre",
  sold: "Vendu",
  rented: "Loué",
};

/** "Appartement 4 pièces à Rehavia" */
export function buildTitle(l: Pick<Listing, "propertyType" | "rooms" | "neighborhood">): string {
  const type = PROPERTY_TYPES[l.propertyType];
  const rooms = l.rooms && l.propertyType !== "studio" ? ` ${formatRooms(l.rooms)}` : "";
  return `${type}${rooms} à ${neighborhoodName(l.neighborhood)}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "vente-appartement-4-pieces-rehavia-8f3a1c" — stable : dérivé de l'id du post. */
export function buildSlug(l: Pick<Listing, "id" | "transaction" | "propertyType" | "rooms" | "neighborhood">): string {
  const prefix = l.transaction === "rent" ? "location" : "vente";
  const shortId = l.id.split("_").pop()!.slice(-6);
  return slugify(`${prefix} ${buildTitle(l).replace(" à ", " ")} ${shortId}`);
}

export const isActive = (l: Listing): boolean => l.status === "available" || l.status === "under-offer";
