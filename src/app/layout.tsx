import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsApp } from "@/components/icons";
import { GUIDES } from "@/content/neighborhood-guides";
import { GUIDES_ARTICLES } from "@/content/guides";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { SITE, absoluteUrl, whatsappUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Agence immobilière francophone à Jérusalem`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name, url: SITE.url, images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE.name }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f13" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const agencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": absoluteUrl("/#agence"),
  name: SITE.name,
  alternateName: SITE.nameHe,
  url: SITE.url,
  logo: absoluteUrl("/logo.png"),
  image: absoluteUrl("/logo.png"),
  telephone: SITE.phone,
  founder: { "@type": "Person", name: SITE.agentName },
  employee: { "@type": "Person", name: SITE.agentName, jobTitle: "Agent immobilier" },
  areaServed: [{ "@type": "City", name: "Jérusalem" }, ...GUIDES.map((g) => ({ "@type": "Place", name: `${NEIGHBORHOODS[g.slug].name}, Jérusalem` }))],
  address: { "@type": "PostalAddress", addressLocality: "Jérusalem", addressCountry: "IL" },
  knowsLanguage: ["fr", "he", "en"],
  sameAs: [SITE.facebookUrl],
  contactPoint: { "@type": "ContactPoint", telephone: SITE.phone, contactType: "sales", availableLanguage: ["French", "Hebrew", "English"] },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#site"),
  url: SITE.url,
  name: SITE.name,
  inLanguage: "fr",
  publisher: { "@id": absoluteUrl("/#agence") },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const menuHoods = GUIDES.slice(0, 8).map((g) => ({ slug: g.slug, name: NEIGHBORHOODS[g.slug].name }));
  const year = new Date().getFullYear();

  return (
    <html lang="fr" dir="ltr" className="no-js">
      <body>
        <a className="skip-link" href="#contenu">Aller au contenu</a>
        <SiteHeader hoods={menuHoods} />

        <main id="contenu" tabIndex={-1}>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <div className="footer-top">
              <div className="footer-brand">
                <Image src="/logo.png" alt={SITE.name} width={96} height={96} />
                <p className="he" lang="he" dir="rtl">{SITE.nameHe}</p>
                <p>L’agence immobilière francophone de {SITE.agentName} à Jérusalem. Achat, vente, location, accompagnement complet.</p>
              </div>
              <nav className="footer-col" aria-labelledby="f-biens">
                <h2 id="f-biens">Immobilier</h2>
                <ul>
                  <li><Link href="/acheter">Appartements à vendre</Link></li>
                  <li><Link href="/louer">Appartements à louer</Link></li>
                  <li><Link href="/vendre">Vendre ou louer mon bien</Link></li>
                  <li><Link href="/quartiers">Tous les quartiers</Link></li>
                  <li><Link href="/a-propos">David Azria</Link></li>
                </ul>
              </nav>
              <nav className="footer-col" aria-labelledby="f-quartiers">
                <h2 id="f-quartiers">Quartiers</h2>
                <ul>
                  {GUIDES.slice(0, 7).map((g) => (
                    <li key={g.slug}><Link href={`/quartiers/${g.slug}`}>Immobilier {NEIGHBORHOODS[g.slug].name}</Link></li>
                  ))}
                </ul>
              </nav>
              <nav className="footer-col" aria-labelledby="f-guides">
                <h2 id="f-guides">Guides</h2>
                <ul>
                  {GUIDES_ARTICLES.slice(0, 5).map((a) => (
                    <li key={a.slug}><Link href={`/guides/${a.slug}`}>{a.short}</Link></li>
                  ))}
                  <li><a href={whatsappUrl("Bonjour David,")} target="_blank" rel="noopener">WhatsApp {SITE.phone}</a></li>
                </ul>
              </nav>
            </div>
            <p className="footer-wordmark" aria-hidden="true">King David Immobilier</p>
            <div className="footer-bottom">
              <span>© {year} {SITE.name} · {SITE.agentName}</span>
              <span>
                <a href={SITE.facebookUrl} target="_blank" rel="noopener">Facebook<span className="sr-only"> (nouvel onglet)</span></a>
              </span>
            </div>
          </div>
        </footer>

        <a className="wa-fab" href={whatsappUrl("Bonjour David, je vous contacte depuis votre site.")} target="_blank" rel="noopener" aria-label="Écrire à David sur WhatsApp (nouvel onglet)">
          <WhatsApp />
          <span className="wa-label" aria-hidden="true">WhatsApp</span>
        </a>

        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([agencyJsonLd, websiteJsonLd]) }} />
      </body>
    </html>
  );
}
