import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PlainHero } from "@/components/blocks";
import { GUIDES_ARTICLES } from "@/content/guides";
import { PHOTOS } from "@/content/photos";

export const metadata: Metadata = {
  title: "Guides immobilier Jérusalem : acheter, louer, frais, alyah",
  description: "Nos guides pour acheter ou louer à Jérusalem : étapes d’un achat, frais et taxe d’achat, avantages olim, lexique des annonces, choix du quartier.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <>
      <PlainHero eyebrow="Guides" title="Tout comprendre de l’immobilier à Jérusalem" lead="Des guides clairs, en français, pour acheter, louer ou investir sereinement en Israël." />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <ul className="guide-grid">
            {GUIDES_ARTICLES.map((a, i) => (
              <li key={a.slug} className="reveal" style={{ ["--rd" as string]: i % 3 }}>
                <Link className="guide-card" href={`/guides/${a.slug}`}>
                  <div className="card-media"><Image src={a.photo.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" priority={i < 3} /></div>
                  <p className="guide-meta">{a.kicker} · {a.readingMinutes} min de lecture</p>
                  <h2 className="h3" style={{ marginTop: 12 }}>{a.title}</h2>
                  <p>{a.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand photo={PHOTOS.dusk} title="Une question qui n’est pas dans nos guides ?" lead="Posez-la directement à David." />
    </>
  );
}
