/**
 * Sync Page Facebook → data/listings.json + public/photos/
 *
 * Lancé toutes les 30 min par GitHub Actions. Ne rappelle l'IA que pour les posts
 * nouveaux ou modifiés (updated_time), donc coût quasi nul en régime normal.
 *
 * Usage : npm run sync   (variables : FB_PAGE_ID, FB_PAGE_TOKEN, ANTHROPIC_API_KEY)
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fetchPagePosts, postImageUrls, type FbPost } from "./lib/facebook";
import { extractListing } from "./lib/extract";
import { savePhotos, deletePhotos } from "./lib/photos";
import { buildSlug, buildTitle } from "../src/lib/format";
import { NEIGHBORHOODS } from "../src/lib/neighborhoods";
import { ListingsFileSchema, ListingSchema, type Listing, type ListingsFile } from "../src/lib/types";

const DATA = path.resolve("data/listings.json");
const IGNORED = path.resolve("data/ignored-posts.json");

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}

/** Décalage déterministe (~150 m) pour que les biens d'un même quartier ne se superposent pas. */
function jitter(id: string): { dLat: number; dLng: number } {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const a = ((h >>> 0) % 3600) / 10;
  const r = 0.0008 + ((h >>> 12) % 100) / 100000;
  return { dLat: Math.sin(a) * r, dLng: Math.cos(a) * r };
}

const photoFolder = (postId: string): string => postId.replace(/[^0-9_]/g, "").replace("_", "-");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function buildListing(client: Anthropic, model: string, post: FbPost): Promise<Listing | null> {
  const x = await extractListing(client, model, post.message ?? "");
  if (!x.isListing) return null;

  const base = { id: post.id, transaction: x.transaction, propertyType: x.propertyType, rooms: x.rooms, neighborhood: x.neighborhood };
  const images = await savePhotos(photoFolder(post.id), postImageUrls(post));
  const center = NEIGHBORHOODS[x.neighborhood];
  const { dLat, dLng } = jitter(post.id);

  return ListingSchema.parse({
    id: post.id,
    slug: buildSlug(base),
    status: x.status,
    transaction: x.transaction,
    propertyType: x.propertyType,
    title: buildTitle(base),
    summary: x.summary,
    description: x.description,
    price: x.price && x.price > 0 ? x.price : null,
    rooms: x.rooms && x.rooms > 0 ? x.rooms : null,
    surface: x.surface && x.surface > 0 ? x.surface : null,
    floor: x.floor,
    totalFloors: x.totalFloors && x.totalFloors > 0 ? x.totalFloors : null,
    neighborhood: x.neighborhood,
    street: x.street,
    features: [...new Set(x.features)],
    images,
    lat: +(center.lat + dLat).toFixed(5),
    lng: +(center.lng + dLng).toFixed(5),
    sourceUrl: post.permalink_url,
    publishedAt: post.created_time,
    updatedAt: post.updated_time,
  });
}

async function main(): Promise<void> {
  const model = env("ANTHROPIC_MODEL", "claude-haiku-5-5");
  const client = new Anthropic({ apiKey: env("ANTHROPIC_API_KEY") });

  const current = ListingsFileSchema.parse(await readJson<ListingsFile>(DATA, { syncedAt: null, listings: [] }));
  const ignored = await readJson<Record<string, string>>(IGNORED, {});
  const known = new Map(current.listings.filter((l) => !l.demo).map((l) => [l.id, l]));

  const posts = await fetchPagePosts({
    pageId: env("FB_PAGE_ID"),
    token: env("FB_PAGE_TOKEN"),
    version: env("FB_GRAPH_VERSION", "v23.0"),
    maxPosts: Number(process.env.FB_MAX_POSTS ?? 300),
  });
  console.log(`→ ${posts.length} posts récupérés`);

  const next = new Map<string, Listing>();
  let created = 0;
  let updated = 0;

  for (const post of posts) {
    if (!post.message?.trim()) continue;
    const existing = known.get(post.id);
    if (existing && existing.updatedAt === post.updated_time) {
      next.set(post.id, existing);
      continue;
    }
    if (!existing && ignored[post.id] === post.updated_time) continue;

    try {
      const listing = await buildListing(client, model, post);
      if (listing) {
        next.set(post.id, listing);
        existing ? updated++ : created++;
        console.log(`  ${existing ? "↻" : "+"} ${listing.title} (${listing.images.length} photos)`);
      } else {
        ignored[post.id] = post.updated_time;
        if (existing) await deletePhotos(photoFolder(post.id));
      }
    } catch (err) {
      console.error(`  ✗ post ${post.id} : ${(err as Error).message}`);
      if (existing) next.set(post.id, existing); // en cas d'erreur, on garde la version précédente
    }
  }

  // Annonces hors de la fenêtre récupérée : conservées. Annonces supprimées de Facebook : retirées.
  const oldestFetched = posts.at(-1)?.created_time ?? "";
  let removed = 0;
  for (const [id, l] of known) {
    if (next.has(id)) continue;
    if (posts.length && l.publishedAt >= oldestFetched) {
      await deletePhotos(photoFolder(id));
      removed++;
      console.log(`  − ${l.title} (post supprimé)`);
    } else {
      next.set(id, l);
    }
  }

  // Les démos disparaissent dès qu'une vraie annonce existe.
  if (next.size) {
    for (const d of current.listings.filter((l) => l.demo)) {
      const local = d.images[0]?.src.startsWith("/photos/") ? d.images[0].src : null;
      if (local) await deletePhotos(path.basename(path.dirname(local)));
    }
  }

  const listings = next.size ? [...next.values()] : current.listings;
  const changed = JSON.stringify(listings) !== JSON.stringify(current.listings);
  // syncedAt ne bouge que si le contenu change → pas de commit (ni de redéploiement) inutile.
  const out: ListingsFile = { syncedAt: changed ? new Date().toISOString() : current.syncedAt, listings };
  await writeFile(DATA, JSON.stringify(out, null, 2) + "\n");
  await writeFile(IGNORED, JSON.stringify(ignored, null, 2) + "\n");
  console.log(`✓ ${created} ajoutée(s), ${updated} mise(s) à jour, ${removed} retirée(s) — ${out.listings.length} au total`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
