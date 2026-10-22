import type { MetadataRoute } from "next";
import { GUIDES_ARTICLES } from "@/content/guides";
import { GUIDES } from "@/content/neighborhood-guides";
import { getActiveNeighborhoods, getListings, getSyncedAt } from "@/lib/listings";
import { isActive } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getSyncedAt() ?? undefined;
  const hoods = new Set<string>([...GUIDES.map((g) => g.slug), ...getActiveNeighborhoods().map((h) => h.slug)]);
  hoods.delete("jerusalem");

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/acheter"), lastModified, changeFrequency: "hourly", priority: 0.95 },
    { url: absoluteUrl("/louer"), lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/quartiers"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/vendre"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/guides"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/a-propos"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.4 },
    ...[...hoods].map((slug) => ({ url: absoluteUrl(`/quartiers/${slug}`), lastModified, changeFrequency: "daily" as const, priority: 0.85 })),
    ...GUIDES_ARTICLES.map((a) => ({ url: absoluteUrl(`/guides/${a.slug}`), lastModified: a.updated, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getListings()
      .filter((l) => !l.demo)
      .map((l) => ({
        url: absoluteUrl(`/biens/${l.slug}`),
        lastModified: l.updatedAt,
        changeFrequency: "weekly" as const,
        priority: isActive(l) ? 0.9 : 0.4,
        images: l.images.slice(0, 5).map((i) => absoluteUrl(i.src)),
      })),
  ];
}
