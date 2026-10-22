import { Breadcrumb, CtaBand, HoodCard, PageHero } from "./blocks";
import { ListingsExplorer } from "./ListingsExplorer";
import { GUIDES } from "@/content/neighborhood-guides";
import type { Photo } from "@/content/photos";
import { PHOTOS } from "@/content/photos";
import { isActive } from "@/lib/format";
import { getListings } from "@/lib/listings";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { referenceNow } from "@/lib/now";
import { absoluteUrl } from "@/lib/site";
import type { Transaction } from "@/lib/types";

const COPY: Record<Transaction, { eyebrow: string; title: string; sub: string; heading: string; crumb: string; path: string; photo: Photo; cta: string }> = {
  sale: {
    eyebrow: "Acheter à Jérusalem",
    title: "Appartements à vendre à Jérusalem",
    sub: "Appartements anciens de caractère, rez-de-jardin, penthouses : une sélection mise à jour en continu, dans les quartiers les plus recherchés.",
    heading: "Biens à vendre",
    crumb: "Acheter",
    path: "/acheter",
    photo: PHOTOS.walls,
    cta: "Bonjour David, je cherche à acheter à Jérusalem.",
  },
  rent: {
    eyebrow: "Louer à Jérusalem",
    title: "Appartements à louer à Jérusalem",
    sub: "Locations meublées ou vides, de l’appartement étudiant à la villa familiale. Visites rapides, bail expliqué en français.",
    heading: "Biens à louer",
    crumb: "Louer",
    path: "/louer",
    photo: PHOTOS.street,
    cta: "Bonjour David, je cherche une location à Jérusalem.",
  },
};

export function TransactionPage({ tx }: { tx: Transaction }) {
  const c = COPY[tx];
  const listings = getListings().filter((l) => l.transaction === tx);
  const active = listings.filter(isActive);
  const counts = new Map<string, number>();
  for (const l of active) counts.set(l.neighborhood, (counts.get(l.neighborhood) ?? 0) + 1);
  const hoods = GUIDES.filter((g) => counts.has(g.slug)).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.title,
      url: absoluteUrl(c.path),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: active.length,
        itemListElement: active.slice(0, 30).map((l, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/biens/${l.slug}`), name: l.title })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: c.crumb, item: absoluteUrl(c.path) },
      ],
    },
  ];

  return (
    <>
      <PageHero
        photo={c.photo}
        eyebrow={c.eyebrow}
        title={c.title}
        sub={`${active.length} bien${active.length > 1 ? "s" : ""} disponible${active.length > 1 ? "s" : ""}. ${c.sub}`}
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { label: c.crumb }]} />}
      />
      <div className="container">
        <ListingsExplorer listings={listings} now={referenceNow()} fixedTransaction={tx} heading={c.heading} />
      </div>

      {hoods.length > 0 && (
        <section className="section" aria-labelledby="tx-hoods">
          <div className="container">
            <p className="eyebrow reveal">Par quartier</p>
            <h2 id="tx-hoods" className="h2 reveal" style={{ margin: "18px 0 40px" }}>Où {tx === "rent" ? "louer" : "acheter"} à Jérusalem ?</h2>
            <ul className="hood-grid">
              {hoods.map((g, i) => (
                <li key={g.slug} className="reveal" style={{ ["--rd" as string]: i }}>
                  <HoodCard href={`/quartiers/${g.slug}`} name={NEIGHBORHOODS[g.slug].name} tagline={g.tagline} photo={g.photo} count={counts.get(g.slug)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand photo={PHOTOS.dusk} title="Vous ne trouvez pas votre bien ?" lead="Décrivez votre recherche : vous recevrez les nouveaux biens dès leur arrivée, souvent avant publication." whatsappText={c.cta} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
