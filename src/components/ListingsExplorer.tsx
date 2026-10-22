"use client";

import { useId, useMemo, useState, useTransition } from "react";
import type { Listing, Transaction } from "@/lib/types";
import { formatPriceShort, isActive } from "@/lib/format";
import { NEIGHBORHOODS, type NeighborhoodSlug } from "@/lib/neighborhoods";
import { ListingCard } from "./ListingCard";
import { ListingsMap, type MapPoint } from "./ListingsMap";

interface Props {
  listings: readonly Listing[];
  now: number;
  /** Masque le filtre quartier (pages quartier). */
  fixedNeighborhood?: boolean;
  /** Fige le type de transaction (pages /acheter, /louer). */
  fixedTransaction?: Transaction;
  heading: string;
}

type TxFilter = "all" | Transaction;
type View = "list" | "map";

const ROOMS = [0, 2, 3, 4, 5] as const;
const BUDGETS: Record<Transaction, readonly number[]> = {
  sale: [2_000_000, 3_000_000, 4_000_000, 6_000_000, 10_000_000],
  rent: [5_000, 7_000, 10_000, 15_000],
};
const fmtBudget = (n: number): string => (n >= 1_000_000 ? `${n / 1_000_000} M₪` : `${new Intl.NumberFormat("fr-FR").format(n)} ₪`);

export function ListingsExplorer({ listings, now, fixedNeighborhood = false, fixedTransaction, heading }: Props) {
  const uid = useId();
  const [, startTransition] = useTransition();
  const [tx, setTx] = useState<TxFilter>(fixedTransaction ?? "all");
  const [minRooms, setMinRooms] = useState<number>(0);
  const [hood, setHood] = useState<NeighborhoodSlug | "all">("all");
  const [budget, setBudget] = useState<number>(0);
  const [showInactive, setShowInactive] = useState(false);
  const [view, setView] = useState<View>("list");

  const hoods = useMemo(() => {
    const set = new Set(listings.map((l) => l.neighborhood));
    return [...set].sort((a, b) => NEIGHBORHOODS[a].name.localeCompare(NEIGHBORHOODS[b].name, "fr"));
  }, [listings]);

  const filtered = useMemo(
    () =>
      listings.filter(
        (l) =>
          (showInactive || isActive(l)) &&
          (tx === "all" || l.transaction === tx) &&
          (minRooms === 0 || (l.rooms ?? 0) >= minRooms) &&
          (hood === "all" || l.neighborhood === hood) &&
          (budget === 0 || (l.price !== null && l.price <= budget)),
      ),
    [listings, showInactive, tx, minRooms, hood, budget],
  );

  const points = useMemo<MapPoint[]>(
    () => filtered.map((l) => ({ id: l.id, lat: l.lat, lng: l.lng, label: formatPriceShort(l), title: l.title, href: `/biens/${l.slug}`, inactive: !isActive(l) })),
    [filtered],
  );

  const inactiveCount = listings.length - listings.filter(isActive).length;
  const reset = (): void => {
    setTx(fixedTransaction ?? "all");
    setMinRooms(0);
    setHood("all");
    setBudget(0);
  };
  const update = (fn: () => void): void => startTransition(fn);

  return (
    <section aria-labelledby={`${uid}-h`}>
      <div className="toolbar" role="search" aria-label="Filtrer les biens">
        <div className="toolbar-row">
          {!fixedTransaction && (
          <div className="segmented" role="group" aria-label="Type de transaction">
            {(["all", "sale", "rent"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={tx === v}
                onClick={() =>
                  update(() => {
                    setTx(v);
                    setBudget(0);
                  })
                }
              >
                {v === "all" ? "Tout" : v === "sale" ? "Achat" : "Location"}
              </button>
            ))}
          </div>
          )}

          <label className="sr-only" htmlFor={`${uid}-rooms`}>Nombre de pièces minimum</label>
          <select id={`${uid}-rooms`} className="select" value={minRooms} onChange={(e) => update(() => setMinRooms(Number(e.target.value)))}>
            {ROOMS.map((r) => (
              <option key={r} value={r}>{r === 0 ? "Pièces : toutes" : `${r} pièces et +`}</option>
            ))}
          </select>

          {!fixedNeighborhood && hoods.length > 1 && (
            <>
              <label className="sr-only" htmlFor={`${uid}-hood`}>Quartier</label>
              <select id={`${uid}-hood`} className="select" value={hood} onChange={(e) => update(() => setHood(e.target.value as NeighborhoodSlug | "all"))}>
                <option value="all">Tous les quartiers</option>
                {hoods.map((h) => (
                  <option key={h} value={h}>{NEIGHBORHOODS[h].name}</option>
                ))}
              </select>
            </>
          )}

          {tx !== "all" && (
            <>
              <label className="sr-only" htmlFor={`${uid}-budget`}>Budget maximum</label>
              <select id={`${uid}-budget`} className="select" value={budget} onChange={(e) => update(() => setBudget(Number(e.target.value)))}>
                <option value={0}>Budget : tous</option>
                {BUDGETS[tx].map((b) => (
                  <option key={b} value={b}>Jusqu’à {fmtBudget(b)}{tx === "rent" ? " / mois" : ""}</option>
                ))}
              </select>
            </>
          )}

          <span className="toolbar-spacer" />

          <div className="segmented" role="group" aria-label="Affichage">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>Liste</button>
            <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>Carte</button>
          </div>
        </div>
      </div>

      <div className="results-meta">
        <h2 id={`${uid}-h`}>{heading}</h2>
        <p className="results-count" aria-live="polite" aria-atomic="true">
          {filtered.length} bien{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {view === "map" ? (
        <ListingsMap points={points} ariaLabel={`Carte de ${filtered.length} biens à Jérusalem`} />
      ) : filtered.length ? (
        <ul className="grid">
          {filtered.map((l, i) => (
            <li key={l.id} style={{ ["--i" as string]: i }}>
              <ListingCard listing={l} now={now} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>Aucun bien ne correspond à ces critères pour le moment.</p>
          <button type="button" className="btn btn-secondary" onClick={reset}>Réinitialiser les filtres</button>
        </div>
      )}

      {inactiveCount > 0 && (
        <p style={{ marginTop: 24 }}>
          <button type="button" className="btn btn-secondary" aria-pressed={showInactive} onClick={() => update(() => setShowInactive((s) => !s))}>
            {showInactive ? "Masquer les biens vendus et loués" : inactiveCount > 1 ? `Voir aussi les ${inactiveCount} biens vendus ou loués` : "Voir aussi le bien vendu ou loué"}
          </button>
        </p>
      )}
    </section>
  );
}
