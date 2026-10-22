"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Révèle les éléments `.reveal` à l'entrée dans le viewport (un seul observer pour tout le site).
 * Sans JS, le contenu reste visible (classe `.no-js` retirée au montage).
 */
export function RevealObserver() {
  const path = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observeAll = (): void => document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [path]);

  return null;
}
