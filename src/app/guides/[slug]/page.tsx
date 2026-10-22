import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, CtaBand, PageHero } from "@/components/blocks";
import { GUIDES_ARTICLES, getArticle } from "@/content/guides";
import { PHOTOS } from "@/content/photos";
import { formatDate } from "@/lib/format";
import { SITE, absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;
export const generateStaticParams = (): Params[] => GUIDES_ARTICLES.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/guides/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.description, images: [{ url: a.photo.src, width: a.photo.width, height: a.photo.height, alt: a.photo.alt }], modifiedTime: a.updated },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const others = GUIDES_ARTICLES.filter((o) => o.slug !== a.slug).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.description,
      image: a.photo.src,
      dateModified: a.updated,
      inLanguage: "fr",
      author: { "@type": "Person", name: SITE.agentName },
      publisher: { "@id": absoluteUrl("/#agence") },
      mainEntityOfPage: absoluteUrl(`/guides/${a.slug}`),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
        { "@type": "ListItem", position: 3, name: a.title, item: absoluteUrl(`/guides/${a.slug}`) },
      ],
    },
  ];

  return (
    <>
      <PageHero
        photo={a.photo}
        eyebrow={`${a.kicker} · ${a.readingMinutes} min de lecture`}
        title={a.title}
        sub={a.description}
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { href: "/guides", label: "Guides" }, { label: a.kicker }]} />}
      />
      <article className="article">
        <div className="container">
          <div className="article-body">
            <p className="muted" style={{ fontSize: 14, marginBottom: 48 }}>
              Par {SITE.agentName} · Mis à jour le <time dateTime={a.updated}>{formatDate(a.updated)}</time>
            </p>
            {a.sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )}
                {s.table && (
                  <div className="table-wrap">
                    <table>
                      <caption>{s.table.caption}</caption>
                      <thead>
                        <tr>{s.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {s.table.rows.map((r) => (
                          <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row" style={{ textTransform: "none", letterSpacing: 0, fontSize: 16, color: "var(--ink)", background: "transparent" }}>{c}</th> : <td key={i}>{c}</td>))}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
            <p className="callout">
              Ce guide est informatif et ne remplace pas le conseil d’un avocat ou d’un conseiller fiscal. Les barèmes sont indexés chaque année : vérifiez les montants en vigueur avant toute décision.{" "}
              <Link href="/contact">Une question ? Écrivez-nous.</Link>
            </p>
            {a.sources && (
              <div className="sources">
                <strong>Sources</strong>
                <ul>
                  {a.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}<span className="sr-only"> (nouvel onglet)</span></a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      <section className="section-tight section-alt" aria-labelledby="more-guides">
        <div className="container">
          <h2 id="more-guides" className="h3" style={{ marginBottom: 32 }}>À lire aussi</h2>
          <ul className="guide-grid">
            {others.map((o) => (
              <li key={o.slug}>
                <Link className="guide-card" href={`/guides/${o.slug}`}>
                  <div className="card-media"><Image src={o.photo.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
                  <p className="guide-meta">{o.kicker}</p>
                  <h3>{o.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand photo={PHOTOS.dusk} title="Prêt à passer à l’action ?" lead="David vous accompagne de la recherche à la remise des clés." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
