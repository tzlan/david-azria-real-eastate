import Image from "next/image";
import Link from "next/link";
import { ArrowLink, CtaBand, Faq, HoodCard } from "@/components/blocks";
import { ListingCard } from "@/components/ListingCard";
import { WhatsApp } from "@/components/icons";
import { HOME_FAQ } from "@/content/faq";
import { GUIDES_ARTICLES } from "@/content/guides";
import { GUIDES } from "@/content/neighborhood-guides";
import { PHOTOS } from "@/content/photos";
import { isActive } from "@/lib/format";
import { getListings } from "@/lib/listings";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { referenceNow } from "@/lib/now";
import { SITE, absoluteUrl, whatsappUrl } from "@/lib/site";

const PILLARS = [
  { title: "En français, de A à Z", text: "Visites, négociation, avocat, banque : chaque étape vous est expliquée dans votre langue, sans mauvaise surprise." },
  { title: "Le terrain, rue par rue", text: "Orientation, bruit, état de l’immeuble, mamad, parking : la connaissance fine du marché que les annonces ne disent pas." },
  { title: "Des biens avant tout le monde", text: "Transmettez votre recherche : vous recevez les nouveaux biens sur WhatsApp dès leur arrivée, souvent avant publication." },
];

const STEPS = [
  { title: "Votre projet", text: "Un premier échange pour cerner quartiers, budget et calendrier." },
  { title: "La sélection", text: "Des biens triés sur le volet, visités en personne ou en vidéo." },
  { title: "La négociation", text: "Le juste prix, défendu avec la connaissance du marché local." },
  { title: "Le juridique", text: "Mise en relation avec avocats et courtiers francophones de confiance." },
  { title: "Les clés", text: "Signature, enregistrement, installation : on reste à vos côtés." },
];

export default function HomePage() {
  const listings = getListings();
  const active = listings.filter(isActive);
  const now = referenceNow();
  const counts = new Map<string, number>();
  for (const l of active) counts.set(l.neighborhood, (counts.get(l.neighborhood) ?? 0) + 1);
  const featuredHoods = [...GUIDES].sort((a, b) => (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0)).slice(0, 5);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Biens immobiliers à Jérusalem",
    numberOfItems: active.length,
    itemListElement: active.slice(0, 30).map((l, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/biens/${l.slug}`), name: l.title })),
  };

  return (
    <>
      {/* ─────────── Hero ─────────── */}
      <section className="hero" data-hero aria-labelledby="hero-title">
        <div className="hero-media">
          <Image src={PHOTOS.hero.src} alt="" fill sizes="100vw" priority />
        </div>
        <div className="container hero-content">
          <Image className="hero-logo rise" src="/logo.png" alt={SITE.name} width={148} height={148} priority />
          <p className="eyebrow rise" style={{ color: "#e7cf9f", ["--rd" as string]: 1 }}>Agence immobilière francophone · Jérusalem</p>
          <h1 id="hero-title" className="display rise" style={{ marginTop: 20, ["--rd" as string]: 2 }}>Votre adresse à Jérusalem.</h1>
          <p className="hero-sub rise" style={{ ["--rd" as string]: 3 }}>
            David Azria vous accompagne pour acheter, vendre ou louer à Rehavia, Talbieh, German Colony, Baka, Katamon et dans toute la ville.
          </p>
          <div className="btn-row rise" style={{ ["--rd" as string]: 4 }}>
            <Link className="btn btn-light" href="/acheter">Voir les biens à vendre</Link>
            <a className="btn btn-outline-light" href={whatsappUrl("Bonjour David, je cherche un bien à Jérusalem.")} target="_blank" rel="noopener">
              <WhatsApp width={18} height={18} /> WhatsApp<span className="sr-only"> (nouvel onglet)</span>
            </a>
          </div>
          <div className="hero-meta rise" style={{ ["--rd" as string]: 5 }}>
            <ul>
              <li>Vente</li>
              <li>Location</li>
              <li>Accompagnement olim</li>
            </ul>
            <span className="scroll-cue" aria-hidden="true"><span />Découvrir</span>
          </div>
        </div>
      </section>

      {/* ─────────── Promesse ─────────── */}
      <section className="section" aria-labelledby="promise-title">
        <div className="container">
          <p className="eyebrow reveal">King David Immobilier</p>
          <h2 id="promise-title" className="statement reveal" style={{ marginTop: 24, ["--rd" as string]: 1 }}>
            Trouver un appartement à Jérusalem, c’est choisir <em>une rue, une communauté, une vie</em>. Nous vous aidons à faire le bon choix.
          </h2>
          <div className="pillars" style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
            {PILLARS.map((p, i) => (
              <article key={p.title} className="pillar reveal" style={{ ["--rd" as string]: i }}>
                <span className="pillar-num">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Biens à la une ─────────── */}
      <section className="section section-alt" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow reveal">Sélection</p>
              <h2 id="featured-title" className="h2 reveal" style={{ ["--rd" as string]: 1 }}>Les biens du moment</h2>
            </div>
            <div className="reveal" style={{ ["--rd" as string]: 2 }}>
              <ArrowLink href="/acheter">Tous les biens à vendre</ArrowLink>
            </div>
          </div>
          <ul className="rail reveal" style={{ ["--rd" as string]: 2 }} aria-label="Biens à la une">
            {active.slice(0, 8).map((l, i) => (
              <li key={l.id}>
                <ListingCard listing={l} now={now} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── Quartiers ─────────── */}
      <section className="section" aria-labelledby="hoods-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow reveal">Quartiers</p>
              <h2 id="hoods-title" className="h2 reveal" style={{ ["--rd" as string]: 1 }}>Chaque quartier a son caractère</h2>
              <p className="lead reveal" style={{ ["--rd" as string]: 2 }}>De la cité-jardin de Rehavia aux maisons templières de la German Colony : nos guides pour choisir où vivre.</p>
            </div>
            <div className="reveal" style={{ ["--rd" as string]: 2 }}>
              <ArrowLink href="/quartiers">Tous les quartiers</ArrowLink>
            </div>
          </div>
          <ul className="hood-grid">
            {featuredHoods.map((g, i) => (
              <li key={g.slug} className="reveal" style={{ ["--rd" as string]: i % 3 }}>
                <HoodCard href={`/quartiers/${g.slug}`} name={NEIGHBORHOODS[g.slug].name} tagline={g.tagline} photo={g.photo} count={counts.get(g.slug)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── David ─────────── */}
      <section className="section section-alt" aria-labelledby="david-title">
        <div className="container split">
          <div className="split-media reveal">
            <Image src={PHOTOS.alley.src} alt={PHOTOS.alley.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <p className="eyebrow reveal">Votre agent</p>
            <h2 id="david-title" className="h2 reveal" style={{ margin: "18px 0 24px", ["--rd" as string]: 1 }}>David Azria</h2>
            <p className="lead reveal" style={{ ["--rd" as string]: 2 }}>
              Francophone installé à Jérusalem, David a fondé King David Immobilier pour offrir aux familles venues de France un accompagnement clair, honnête et local.
            </p>
            <p className="muted reveal" style={{ marginTop: 18, maxWidth: "56ch", ["--rd" as string]: 3 }}>
              Il publie chaque nouveau bien sur Facebook et sur ce site, répond personnellement sur WhatsApp et vous accompagne jusqu’à la remise des clés.
            </p>
            <div className="btn-row reveal" style={{ marginTop: 32, ["--rd" as string]: 4 }}>
              <Link className="btn btn-primary" href="/a-propos">Découvrir l’agence</Link>
              <a className="btn btn-ghost" href={whatsappUrl("Bonjour David,")} target="_blank" rel="noopener">{SITE.phone}<span className="sr-only"> sur WhatsApp (nouvel onglet)</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Méthode ─────────── */}
      <section className="section section-navy" aria-labelledby="steps-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow reveal">Méthode</p>
              <h2 id="steps-title" className="h2 reveal" style={{ ["--rd" as string]: 1 }}>De la première visite aux clés</h2>
            </div>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal" style={{ ["--rd" as string]: i }}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── Guides ─────────── */}
      <section className="section" aria-labelledby="guides-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow reveal">Guides</p>
              <h2 id="guides-title" className="h2 reveal" style={{ ["--rd" as string]: 1 }}>Tout comprendre avant d’acheter</h2>
            </div>
            <div className="reveal" style={{ ["--rd" as string]: 2 }}>
              <ArrowLink href="/guides">Tous les guides</ArrowLink>
            </div>
          </div>
          <ul className="guide-grid">
            {GUIDES_ARTICLES.slice(0, 3).map((a, i) => (
              <li key={a.slug} className="reveal" style={{ ["--rd" as string]: i }}>
                <Link className="guide-card" href={`/guides/${a.slug}`}>
                  <div className="card-media"><Image src={a.photo.src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
                  <p className="guide-meta">{a.kicker} · {a.readingMinutes} min</p>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="section-alt"><Faq items={HOME_FAQ} /></div>

      <CtaBand photo={PHOTOS.dusk} title="Parlons de votre projet à Jérusalem." lead="Une question, une visite, une estimation : David vous répond personnellement." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </>
  );
}
