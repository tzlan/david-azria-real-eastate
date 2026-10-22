import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb, CtaBand, PageHero } from "@/components/blocks";
import { WhatsApp } from "@/components/icons";
import { PHOTOS } from "@/content/photos";
import { SITE, absoluteUrl, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "David Azria, agent immobilier francophone à Jérusalem",
  description: "King David Immobilier, l’agence de David Azria : un agent francophone à Jérusalem pour acheter, vendre ou louer en toute confiance.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  { title: "Transparence", text: "Le vrai état d’un bien, le vrai prix du marché, les vrais frais. Vous décidez en connaissance de cause." },
  { title: "Proximité", text: "Un seul interlocuteur, joignable sur WhatsApp, qui connaît votre projet et votre famille." },
  { title: "Exigence", text: "Peu de biens, mais bien choisis. Nous préférons vous dire non plutôt que vous faire perdre votre temps." },
];

export default function AboutPage() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.agentName,
    jobTitle: "Agent immobilier",
    worksFor: { "@id": absoluteUrl("/#agence") },
    knowsLanguage: ["fr", "he", "en"],
    workLocation: { "@type": "City", name: "Jérusalem" },
    sameAs: [SITE.facebookUrl],
  };

  return (
    <>
      <PageHero
        photo={PHOTOS.panorama}
        eyebrow="L’agence"
        title="King David Immobilier"
        sub="Une agence à taille humaine, fondée par David Azria pour accompagner les francophones qui choisissent Jérusalem."
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { label: "David Azria" }]} />}
      />

      <section className="section" aria-labelledby="about-title">
        <div className="container split">
          <div className="reveal" style={{ display: "grid", placeItems: "center", aspectRatio: "1", background: "#1b2030", borderRadius: "var(--radius-lg)" }}>
            <Image src="/logo.png" alt={SITE.name} width={320} height={320} style={{ width: "62%", height: "auto", borderRadius: "50%" }} />
          </div>
          <div>
            <p className="eyebrow reveal">Votre agent</p>
            <h2 id="about-title" className="h2 reveal" style={{ margin: "18px 0 24px" }}>David Azria</h2>
            <div className="prose reveal">
              <p>King David Immobilier — קינג דוד נדל״ן — est né d’une conviction : acheter ou louer à Jérusalem quand on vient de France ne devrait pas être un parcours d’obstacles.</p>
              <p>David accompagne ses clients en français, du premier appel à la remise des clés : sélection des biens, visites, négociation, mise en relation avec avocats et courtiers de confiance.</p>
              <p>Chaque nouveau bien est publié sur sa page Facebook et sur ce site, en temps réel.</p>
            </div>
            <div className="btn-row reveal" style={{ marginTop: 32 }}>
              <a className="btn btn-whatsapp" href={whatsappUrl("Bonjour David,")} target="_blank" rel="noopener">
                <WhatsApp width={18} height={18} /> {SITE.phone}<span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="values-title">
        <div className="container">
          <p className="eyebrow reveal">Nos engagements</p>
          <h2 id="values-title" className="h2 reveal" style={{ margin: "18px 0 48px" }}>Ce qui nous guide</h2>
          <div className="pillars">
            {VALUES.map((v, i) => (
              <article key={v.title} className="pillar reveal" style={{ ["--rd" as string]: i }}>
                <span className="pillar-num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand photo={PHOTOS.dusk} title="Faisons connaissance." lead="Un appel de 15 minutes suffit pour cerner votre projet." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
    </>
  );
}
