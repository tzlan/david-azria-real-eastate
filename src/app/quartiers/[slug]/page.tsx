import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentPanel } from "@/components/AgentPanel";
import { Breadcrumb, CtaBand, HoodCard, PageHero } from "@/components/blocks";
import { Check } from "@/components/icons";
import { ListingsExplorer } from "@/components/ListingsExplorer";
import { GUIDES, getGuide } from "@/content/neighborhood-guides";
import { PHOTOS } from "@/content/photos";
import { formatPrice, isActive } from "@/lib/format";
import { getActiveNeighborhoods, getListingsByNeighborhood } from "@/lib/listings";
import { NEIGHBORHOODS, type NeighborhoodSlug } from "@/lib/neighborhoods";
import { referenceNow } from "@/lib/now";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  const slugs = new Set<string>([...GUIDES.map((g) => g.slug), ...getActiveNeighborhoods().map((h) => h.slug)]);
  slugs.delete("jerusalem");
  return [...slugs].map((slug) => ({ slug }));
}

const isHood = (s: string): s is NeighborhoodSlug => s in NEIGHBORHOODS;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isHood(slug)) return {};
  const name = NEIGHBORHOODS[slug].name;
  const guide = getGuide(slug);
  const count = getListingsByNeighborhood(slug).filter(isActive).length;
  const avail = count ? `${count} bien${count > 1 ? "s" : ""} disponible${count > 1 ? "s" : ""}. ` : "";
  return {
    title: `Immobilier ${name}, Jérusalem : appartements à vendre et à louer`,
    description: `${avail}${guide ? guide.tagline + " " : ""}Guide du quartier ${name} à Jérusalem et biens à vendre ou à louer avec un agent francophone.`.slice(0, 300),
    alternates: { canonical: `/quartiers/${slug}` },
    openGraph: guide ? { images: [{ url: guide.photo.src, width: guide.photo.width, height: guide.photo.height, alt: guide.photo.alt }] } : undefined,
  };
}

export default async function NeighborhoodPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!isHood(slug)) notFound();

  const name = NEIGHBORHOODS[slug].name;
  const guide = getGuide(slug);
  const listings = getListingsByNeighborhood(slug);
  const active = listings.filter(isActive);
  const sale = active.filter((l) => l.transaction === "sale" && l.price !== null).map((l) => l.price!);
  const range = sale.length > 1 ? `de ${formatPrice({ price: Math.min(...sale), transaction: "sale" })} à ${formatPrice({ price: Math.max(...sale), transaction: "sale" })}` : null;
  const nearby = GUIDES.filter((g) => g.slug !== slug)
    .map((g) => ({ g, d: Math.hypot(NEIGHBORHOODS[g.slug].lat - NEIGHBORHOODS[slug].lat, NEIGHBORHOODS[g.slug].lng - NEIGHBORHOODS[slug].lng) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(({ g }) => g);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Quartiers", item: absoluteUrl("/quartiers") },
        { "@type": "ListItem", position: 3, name, item: absoluteUrl(`/quartiers/${slug}`) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: `${name}, Jérusalem`,
      geo: { "@type": "GeoCoordinates", latitude: NEIGHBORHOODS[slug].lat, longitude: NEIGHBORHOODS[slug].lng },
      containedInPlace: { "@type": "City", name: "Jérusalem" },
      ...(guide && { description: guide.intro[0] }),
    },
  ];

  return (
    <>
      <PageHero
        photo={guide?.photo ?? PHOTOS.rooftops}
        eyebrow={`Quartier · Jérusalem`}
        title={`Immobilier à ${name}`}
        sub={guide?.tagline ?? `Appartements à vendre et à louer à ${name}, Jérusalem.`}
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { href: "/quartiers", label: "Quartiers" }, { label: name }]} />}
      />

      {guide && (
        <section className="section" aria-labelledby="guide-title">
          <div className="container hood-layout">
            <div>
              <p className="eyebrow reveal">Vivre à {name}</p>
              <h2 id="guide-title" className="h2 reveal" style={{ margin: "18px 0 28px" }}>{guide.tagline}</h2>
              <div className="prose reveal">
                {guide.intro.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
            <aside className="reveal" style={{ ["--rd" as string]: 1 }}>
              <h3 className="h3" style={{ marginBottom: 20 }}>Les atouts</h3>
              <ul className="check-list">
                {guide.highlights.map((h) => <li key={h}><Check />{h}</li>)}
              </ul>
              <h3 className="h3" style={{ margin: "40px 0 16px" }}>Idéal pour</h3>
              <ul className="tag-list">
                {guide.idealFor.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </aside>
          </div>
        </section>
      )}

      <section className={guide ? "section-tight section-alt" : "section-tight"} aria-label={`Biens à ${name}`}>
        <div className="container">
          {listings.length ? (
            <>
              {range && <p className="lead" style={{ marginBottom: 8 }}>Biens à la vente à {name} : {range}.</p>}
              <ListingsExplorer listings={listings} now={referenceNow()} fixedNeighborhood heading={`Biens à ${name}`} />
            </>
          ) : (
            <div className="empty">
              <p>Aucun bien publié à {name} en ce moment. Les meilleures opportunités partent souvent avant publication.</p>
              <p style={{ marginTop: 8 }}>Laissez votre recherche à David pour être prévenu en priorité.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="hood-contact">
        <div className="container split">
          <div>
            <p className="eyebrow reveal">Recherche à {name}</p>
            <h2 id="hood-contact" className="h2 reveal" style={{ margin: "18px 0 20px" }}>Soyez prévenu en premier.</h2>
            <p className="lead reveal">Décrivez votre projet à {name} : David vous envoie les biens correspondants dès leur arrivée.</p>
            {nearby.length > 0 && (
              <p className="muted reveal" style={{ marginTop: 28 }}>
                Quartiers voisins :{" "}
                {nearby.map((g, i) => (
                  <span key={g.slug}>
                    <Link href={`/quartiers/${g.slug}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{NEIGHBORHOODS[g.slug].name}</Link>
                    {i < nearby.length - 1 ? ", " : "."}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="reveal" style={{ ["--rd" as string]: 1 }}>
            <AgentPanel context={`Recherche à ${name}`} />
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="section-tight section-alt" aria-labelledby="nearby-title">
          <div className="container">
            <h2 id="nearby-title" className="h3 reveal" style={{ marginBottom: 28 }}>À découvrir aussi</h2>
            <ul className="hood-grid hood-grid-3">
              {nearby.map((g, i) => (
                <li key={g.slug} className="reveal" style={{ ["--rd" as string]: i }}>
                  <HoodCard href={`/quartiers/${g.slug}`} name={NEIGHBORHOODS[g.slug].name} tagline={g.tagline} photo={g.photo} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand photo={PHOTOS.dusk} title={`Votre projet à ${name}`} whatsappText={`Bonjour David, je cherche un bien à ${name}.`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
