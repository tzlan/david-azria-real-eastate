"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NeighborhoodSlug } from "@/lib/neighborhoods";
import { SITE, whatsappUrl } from "@/lib/site";
import { WhatsApp } from "./icons";

interface Props {
  hoods: { slug: NeighborhoodSlug; name: string }[];
}

const PRIMARY = [
  { href: "/acheter", label: "Acheter" },
  { href: "/louer", label: "Louer" },
  { href: "/vendre", label: "Vendre" },
  { href: "/quartiers", label: "Quartiers" },
  { href: "/guides", label: "Guides" },
  { href: "/a-propos", label: "David Azria" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ hoods }: Props) {
  const path = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture à chaque navigation
  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || open ? "true" : "false"}>
        <div className="container header-inner">
          <div className="header-left">
            <button
              ref={btnRef}
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="menu-icon" aria-hidden="true" />
              <span className="menu-label">{open ? "Fermer" : "Menu"}</span>
              <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            </button>
            <Link href="/acheter" className="header-link">Acheter</Link>
            <Link href="/louer" className="header-link">Louer</Link>
          </div>

          <Link href="/" className="brand" aria-label={`${SITE.name}, accueil`}>
            <Image src="/logo.png" alt="" width={44} height={44} priority />
            <span className="brand-name" aria-hidden="true">
              <strong>King David</strong>
              <span>Immobilier · Jérusalem</span>
            </span>
          </Link>

          <div className="header-right">
            <Link href="/vendre" className="header-link">Vendre</Link>
            <a className="header-cta" href={whatsappUrl("Bonjour David,")} target="_blank" rel="noopener">
              <WhatsApp width={16} height={16} />
              <span>Contact</span>
              <span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
            </a>
          </div>
        </div>
      </header>

      <nav id={menuId} className="menu-overlay" data-open={open} aria-label="Menu principal" aria-hidden={!open} inert={!open}>
        <div className="container menu-grid">
          <ul className="menu-primary">
            {PRIMARY.map((l, i) => (
              <li key={l.href} style={{ ["--d" as string]: i }}>
                <Link href={l.href} ref={i === 0 ? firstLinkRef : undefined} aria-current={path === l.href ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-col">
            <h2>Quartiers</h2>
            <ul>
              {hoods.map((h, i) => (
                <li key={h.slug} style={{ ["--d" as string]: i + 4 }}>
                  <Link href={`/quartiers/${h.slug}`}>{h.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-col">
            <h2>Contact</h2>
            <ul>
              <li style={{ ["--d" as string]: 6 }}><a href={whatsappUrl("Bonjour David,")} target="_blank" rel="noopener">WhatsApp · {SITE.phone}</a></li>
              <li style={{ ["--d" as string]: 7 }}><a href={SITE.facebookUrl} target="_blank" rel="noopener">Facebook</a></li>
              <li style={{ ["--d" as string]: 8 }}><Link href="/contact">Formulaire de contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
