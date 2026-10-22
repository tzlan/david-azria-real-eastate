import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentPanel } from "@/components/AgentPanel";
import { Breadcrumb } from "@/components/blocks";
import { Check } from "@/components/icons";
import { Gallery } from "@/components/Gallery";
import { ListingCard } from "@/components/ListingCard";
import { ListingsMap } from "@/components/ListingsMap";
import { getListing, getListings, getSimilar } from "@/lib/listings";
import { STATUS_LABEL, formatDate, formatFloor, formatNumber, formatPrice, formatRooms, isActive } from "@/lib/format";
import { neighborhoodName } from "@/lib/neighborhoods";
import { referenceNow } from "@/lib/now";
import { absoluteUrl } from "@/lib/site";
import { FEATURES, PROPERTY_TYPES, type Listing } from "@/lib/types";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getListings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const l = getListing((await params).slug);
  if (!l) return {};
  const price = l.price !== null ? ` — ${formatPrice(l)}` : "";
  const title = `${l.transaction === "rent" ? "Location" : "Vente"} ${l.title}${price}`;
  const cover = l.images[0];
  return {
    title,
    description: l.summary,
    alternates: { canonical: `/biens/${l.slug}` },
    robots: l.demo ? { index: false } : undefined,
    openGraph: {
      title,
      description: l.summary,
      url: `/biens/${l.slug}`,
      type: "article",
      images: cover ? [{ url: cover.src, width: cover.width, height: cover.height, alt: l.title }] : undefined,
    },
  };
}

function jsonLd(l: Listing) {
  const url = absoluteUrl(`/biens/${l.slug}`);
  const accommodation = {
    "@type": l.propertyType === "house" || l.propertyType === "cottage" ? "SingleFamilyResidence" : "Apartment",
    name: l.title,
    ...(l.rooms !== null && { numberOfRooms: l.rooms }),
    ...(l.surface !== null && { floorSize: { "@type": "QuantitativeValue", value: l.surface, unitCode: "MTK" } }),
    ...(l.floor !== null && { floorLevel: String(l.floor) }),
    address: { "@type": "PostalAddress", addressLocality: "Jérusalem", addressRegion: neighborhoodName(l.neighborhood), addressCountry: "IL", ...(l.street && { streetAddress: l.street }) },
    geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng },
    amenityFeature: l.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: FEATURES[f], value: true })),
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "@id": url,
      url,
      name: l.title,
      description: l.summary,
      datePosted: l.publishedAt,
      dateModified: l.updatedAt,
      image: l.images.map((i) => absoluteUrl(i.src)),
      about: accommodation,
      offers: {
        "@type": "Offer",
        businessFunction: l.transaction === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
        availability: isActive(l) ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        ...(l.price !== null && { price: l.price, priceCurrency: "ILS" }),
        seller: { "@id": absoluteUrl("/#agence") },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: neighborhoodName(l.neighborhood), item: absoluteUrl(`/quartiers/${l.neighborhood}`) },
        { "@type": "ListItem", position: 3, name: l.title, item: url },
      ],
    },
  ];
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const l = getListing((await params).slug);
  if (!l) notFound();

  const hood = neighborhoodName(l.neighborhood);
  const similar = getSimilar(l);
  const now = referenceNow();
  const facts: [string, string][] = [
    ["Type", PROPERTY_TYPES[l.propertyType]],
    ...(l.rooms !== null ? [["Pièces", formatRooms(l.rooms)] as [string, string]] : []),
    ...(l.surface !== null ? [["Surface", `${formatNumber(l.surface)} m²`] as [string, string]] : []),
    ...(l.floor !== null ? [["Étage", formatFloor(l.floor, l.totalFloors)] as [string, string]] : []),
    ["Quartier", hood],
    ...(l.street ? [["Rue", l.street] as [string, string]] : []),
  ];

  return (
    <article className="container listing-top">
      <Breadcrumb items={[{ href: "/", label: "Accueil" }, { href: l.transaction === "rent" ? "/louer" : "/acheter", label: l.transaction === "rent" ? "Louer" : "Acheter" }, { href: `/quartiers/${l.neighborhood}`, label: hood }, { label: l.title }]} />

      <header className="listing-head">
        <div className="rise">
          <span className="status-pill" data-status={l.status}>
            {STATUS_LABEL[l.status]} · {l.transaction === "rent" ? "Location" : "Vente"} · {hood}
          </span>
          <h1>{l.title}</h1>
          <p className="lead">{l.summary}</p>
        </div>
        <p className="listing-price rise" style={{ ["--rd" as string]: 1 }}>
          {formatPrice(l)}
          {l.price !== null && l.surface !== null && l.transaction === "sale" && (
            <small>{new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(l.price / l.surface)} ₪ / m²</small>
          )}
        </p>
      </header>

      <div className="rise" style={{ ["--rd" as string]: 2 }}>
        <Gallery images={l.images} alt={l.title} />
      </div>

      <div className="listing-layout">
        <div>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div className="fact" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <section className="block prose" aria-labelledby="desc-title">
            <h2 id="desc-title">Description</h2>
            {l.description.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {l.features.length > 0 && (
            <section className="block features" aria-labelledby="feat-title">
              <h2 id="feat-title">Prestations</h2>
              <ul>
                {l.features.map((f) => (
                  <li key={f}><Check />{FEATURES[f]}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="block" aria-labelledby="map-title">
            <h2 id="map-title">Emplacement</h2>
            <ListingsMap
              variant="area"
              className="map-shell-compact"
              ariaLabel={`Zone approximative du bien à ${hood}`}
              points={[{ id: l.id, lat: l.lat, lng: l.lng, label: "", title: l.title, href: "" }]}
            />
            <p className="map-note">
              Zone approximative à {hood}. L’adresse exacte est communiquée lors de la visite.{" "}
              <Link href={`/quartiers/${l.neighborhood}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Découvrir le quartier {hood}</Link>
            </p>
          </section>

          <p className="map-note" style={{ marginTop: 40 }}>
            Publié le <time dateTime={l.publishedAt}>{formatDate(l.publishedAt)}</time> ·{" "}
            <a href={l.sourceUrl} target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>
              Voir sur Facebook<span className="sr-only"> (nouvel onglet)</span>
            </a>
          </p>
        </div>

        <aside aria-label="Contacter l’agent">
          <div className="aside-sticky">
            <AgentPanel listingSlug={l.slug} listingTitle={l.title} listingUrl={absoluteUrl(`/biens/${l.slug}`)} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="section" aria-labelledby="similar-title">
          <p className="eyebrow reveal">À voir aussi</p>
          <h2 id="similar-title" className="h2 reveal" style={{ margin: "18px 0 40px" }}>Biens similaires</h2>
          <ul className="grid">
            {similar.map((s, i) => (
              <li key={s.id} style={{ ["--i" as string]: i }}>
                <ListingCard listing={s} now={now} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(l)) }} />
    </article>
  );
}
