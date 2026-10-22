import "server-only";
import raw from "../../data/listings.json";
import { ListingsFileSchema, type Listing } from "./types";
import { isActive } from "./format";
import type { NeighborhoodSlug } from "./neighborhoods";

/** Validé au build : un JSON corrompu casse le build, jamais la prod. */
const file = ListingsFileSchema.parse(raw);

const byDate = (a: Listing, b: Listing): number => b.publishedAt.localeCompare(a.publishedAt);

/** Actifs d'abord (plus récents en tête), puis vendus/loués (preuve sociale + SEO). */
const ALL: readonly Listing[] = [...file.listings.filter(isActive).sort(byDate), ...file.listings.filter((l) => !isActive(l)).sort(byDate)];

const BY_SLUG = new Map(ALL.map((l) => [l.slug, l]));

export const getListings = (): readonly Listing[] => ALL;
export const getListing = (slug: string): Listing | undefined => BY_SLUG.get(slug);
export const getSyncedAt = (): string | null => file.syncedAt;

export function getListingsByNeighborhood(slug: NeighborhoodSlug): Listing[] {
  return ALL.filter((l) => l.neighborhood === slug);
}

/** Quartiers ayant au moins une annonce, triés par nombre d'annonces. */
export function getActiveNeighborhoods(): { slug: NeighborhoodSlug; count: number }[] {
  const counts = new Map<NeighborhoodSlug, number>();
  for (const l of ALL) counts.set(l.neighborhood, (counts.get(l.neighborhood) ?? 0) + 1);
  return [...counts.entries()].map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count);
}

export function getSimilar(l: Listing, limit = 3): Listing[] {
  return ALL.filter((o) => o.id !== l.id && isActive(o) && o.transaction === l.transaction)
    .map((o) => ({ o, score: (o.neighborhood === l.neighborhood ? 2 : 0) + (o.rooms === l.rooms ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ o }) => o);
}
