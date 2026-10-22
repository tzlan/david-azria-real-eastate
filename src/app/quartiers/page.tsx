import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, CtaBand, HoodCard, PageHero } from "@/components/blocks";
import { GUIDES } from "@/content/neighborhood-guides";
import { PHOTOS } from "@/content/photos";
import { isActive } from "@/lib/format";
import { getActiveNeighborhoods, getListings } from "@/lib/listings";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export const metadata: Metadata = {
  title: "Les quartiers de Jérusalem : guide pour bien choisir",
  description: "Rehavia, Talbieh, German Colony, Baka, Katamon, Yemin Moshe, Nachlaot… Guide des quartiers de Jérusalem pour acheter ou louer quand on est francophone.",
  alternates: { canonical: "/quartiers" },
};

export default function NeighborhoodsIndex() {
  const counts = new Map<string, number>();
  for (const l of getListings().filter(isActive)) counts.set(l.neighborhood, (counts.get(l.neighborhood) ?? 0) + 1);
  const guided = new Set(GUIDES.map((g) => g.slug));
  const others = getActiveNeighborhoods().filter((h) => !guided.has(h.slug));

  return (
    <>
      <PageHero
        photo={PHOTOS.rooftops}
        eyebrow="Guide des quartiers"
        title="Les quartiers de Jérusalem"
        sub="Ambiance, architecture, communautés, type de biens : tout ce qu’il faut savoir pour choisir où vivre à Jérusalem."
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { label: "Quartiers" }]} />}
      />
      <section className="section">
        <div className="container">
          <ul className="hood-grid">
            {GUIDES.map((g, i) => (
              <li key={g.slug} className="reveal" style={{ ["--rd" as string]: i % 3 }}>
                <HoodCard href={`/quartiers/${g.slug}`} name={NEIGHBORHOODS[g.slug].name} tagline={g.tagline} photo={g.photo} count={counts.get(g.slug)} />
              </li>
            ))}
          </ul>
          {others.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <h2 className="h3 reveal" style={{ marginBottom: 20 }}>Autres quartiers avec des biens disponibles</h2>
              <ul className="tag-list reveal">
                {others.map((h) => (
                  <li key={h.slug}><Link href={`/quartiers/${h.slug}`}>{NEIGHBORHOODS[h.slug].name} ({h.count})</Link></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <CtaBand photo={PHOTOS.dusk} title="Vous hésitez entre plusieurs quartiers ?" lead="Dites-nous comment vous vivez : on vous propose les quartiers et les biens qui vous correspondent." />
    </>
  );
}
