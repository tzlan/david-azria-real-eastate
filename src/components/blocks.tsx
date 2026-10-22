import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Photo } from "@/content/photos";
import type { FaqItem } from "@/content/faq";
import { SITE, whatsappUrl } from "@/lib/site";
import { ArrowRight, WhatsApp } from "./icons";

/* ───────── Hero de page intérieure (photo plein cadre) ───────── */
export function PageHero({ photo, eyebrow, title, sub, children, crumbs }: { photo: Photo; eyebrow: string; title: string; sub?: string; children?: ReactNode; crumbs?: ReactNode }) {
  return (
    <section className="page-hero" data-hero aria-labelledby="page-title">
      <div className="hero-media">
        <Image src={photo.src} alt="" fill sizes="100vw" priority />
      </div>
      <div className="container hero-content">
        {crumbs}
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 id="page-title" className="h1 rise" style={{ ["--rd" as string]: 1, marginTop: 18 }}>{title}</h1>
        {sub && <p className="hero-sub rise" style={{ ["--rd" as string]: 2 }}>{sub}</p>}
        {children}
      </div>
    </section>
  );
}

/* ───────── Hero simple (sans photo) ───────── */
export function PlainHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="plain-hero" aria-labelledby="page-title">
      <div className="container">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 id="page-title" className="h1 rise" style={{ ["--rd" as string]: 1 }}>{title}</h1>
        {lead && <p className="lead rise" style={{ ["--rd" as string]: 2 }}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/* ───────── Bandeau CTA photo ───────── */
export function CtaBand({ photo, eyebrow = SITE.name, title, lead, whatsappText }: { photo: Photo; eyebrow?: string; title: string; lead?: string; whatsappText?: string }) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <Image src={photo.src} alt="" fill sizes="100vw" />
      <div className="container reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="cta-title" className="h2">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
        <div className="btn-row">
          <a className="btn btn-whatsapp" href={whatsappUrl(whatsappText ?? "Bonjour David,")} target="_blank" rel="noopener">
            <WhatsApp width={18} height={18} /> Écrire à David<span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
          </a>
          <Link className="btn btn-outline-light" href="/contact">Être rappelé</Link>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ (accordéon natif + JSON-LD) ───────── */
export function Faq({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container narrow">
        <p className="eyebrow reveal">FAQ</p>
        <h2 id="faq-title" className="h2 reveal" style={{ margin: "18px 0 40px" }}>{title}</h2>
        <div className="faq reveal">
          {items.map((i) => (
            <details key={i.q}>
              <summary>{i.q}</summary>
              <p>{i.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

/* ───────── Carte quartier photo ───────── */
export function HoodCard({ href, name, tagline, photo, count }: { href: string; name: string; tagline: string; photo: Photo; count?: number }) {
  return (
    <Link className="hood-card" href={href}>
      <Image src={photo.src} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />
      <div className="hood-card-body">
        <div>
          <h3>{name}</h3>
          <p>{tagline}</p>
        </div>
        {count ? <span className="hood-count">{count} bien{count > 1 ? "s" : ""}</span> : null}
      </div>
    </Link>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="link-arrow" href={href}>
      {children} <ArrowRight />
    </Link>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Fil d’Ariane">
      <ol>
        {items.map((it, i) =>
          it.href ? (
            <li key={i}><Link href={it.href}>{it.label}</Link></li>
          ) : (
            <li key={i} aria-current="page">{it.label}</li>
          ),
        )}
      </ol>
    </nav>
  );
}
