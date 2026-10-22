import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { STATUS_LABEL, formatFloor, formatNumber, formatPrice, formatRooms, isActive } from "@/lib/format";
import { neighborhoodName } from "@/lib/neighborhoods";

const NEW_MS = 7 * 24 * 3600 * 1000;

interface Props {
  listing: Listing;
  /** Horodatage de référence fourni par le serveur (évite tout écart d'hydratation). */
  now: number;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}

export function ListingCard({ listing: l, now, priority = false, headingLevel: H = "h3" }: Props) {
  const active = isActive(l);
  const isNew = active && now - Date.parse(l.publishedAt) < NEW_MS;
  const cover = l.images[0];

  return (
    <article className="card" data-inactive={!active} aria-labelledby={`t-${l.id}`}>
      <div className="card-media">
        {l.status !== "available" && <span className={`badge badge-${l.status}`}>{STATUS_LABEL[l.status]}</span>}
        {isNew && <span className="badge badge-new">Nouveau</span>}
        {cover && (
          <Image
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 440px"
            priority={priority}
          />
        )}
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-hood">{neighborhoodName(l.neighborhood)} · {l.transaction === "rent" ? "Location" : "Vente"}</span>
        </div>
        <H className="card-title" id={`t-${l.id}`}>
          <Link href={`/biens/${l.slug}`}>{l.title}</Link>
        </H>
        <p className="card-price">{formatPrice(l)}</p>
        <ul className="card-facts" aria-label="Caractéristiques">
          {l.rooms !== null && <li>{formatRooms(l.rooms)}</li>}
          {l.surface !== null && <li>{formatNumber(l.surface)} m²</li>}
          {l.floor !== null && <li>{formatFloor(l.floor, null)}</li>}
        </ul>
      </div>
    </article>
  );
}
