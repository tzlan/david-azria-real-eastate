"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Biens" },
  { href: "/#quartiers", label: "Quartiers", hideSm: true },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Navigation principale">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={"hideSm" in l ? "nav-hide-sm" : undefined}
          aria-current={path === l.href || (l.href === "/" && path.startsWith("/biens")) ? "page" : undefined}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
