"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ListingImage } from "@/lib/types";

interface Props {
  images: readonly ListingImage[];
  alt: string;
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d={dir === "left" ? "M11 3 5 9l6 6" : "m7 3 6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Gallery({ images, alt }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = images.length;

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let raf = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIndex(Math.round(t.scrollLeft / t.clientWidth)));
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      t.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = useCallback((i: number) => {
    const t = track.current;
    if (t) t.scrollTo({ left: Math.max(0, Math.min(i, total - 1)) * t.clientWidth });
  }, [total]);

  if (!total) return null;

  return (
    <div className="gallery" role="region" aria-roledescription="carrousel" aria-label={`Photos : ${alt}`}>
      <div
        ref={track}
        className="gallery-track"
        tabIndex={0}
        aria-label="Faites défiler avec les flèches du clavier"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
        }}
      >
        {images.map((img, i) => (
          <div key={img.src} className="gallery-slide" role="group" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${total}`}>
            <Image
              src={img.src}
              alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
              width={img.width}
              height={img.height}
              sizes="(max-width: 1240px) 100vw, 1240px"
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
            />
          </div>
        ))}
      </div>
      {total > 1 && (
        <>
          <button type="button" className="gallery-btn gallery-prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Photo précédente">
            <Chevron dir="left" />
          </button>
          <button type="button" className="gallery-btn gallery-next" onClick={() => go(index + 1)} disabled={index >= total - 1} aria-label="Photo suivante">
            <Chevron dir="right" />
          </button>
          <span className="gallery-counter" aria-live="polite">{index + 1} / {total}</span>
        </>
      )}
    </div>
  );
}
