import "server-only";
import { getListings, getSyncedAt } from "./listings";

/** Instant de référence déterministe (dernier sync) : identique serveur/client, rebuild à chaque sync. */
export function referenceNow(): number {
  const synced = getSyncedAt();
  if (synced) return Date.parse(synced);
  const latest = getListings().reduce((max, l) => (l.publishedAt > max ? l.publishedAt : max), "");
  return latest ? Date.parse(latest) : 0;
}
