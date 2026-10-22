"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  title: string;
  href: string;
  inactive?: boolean;
}

interface Props {
  points: readonly MapPoint[];
  /** "area" : un seul bien, zone approximative (pas de pin de prix). */
  variant?: "pins" | "area";
  ariaLabel: string;
  className?: string;
}

const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
} as const;
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
const JERUSALEM: [number, number] = [31.7767, 35.2134];

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Carte Leaflet chargée à la demande (hors bundle initial), tuiles claires/sombres
 * synchronisées avec le thème système. Le conteneur a des dimensions fixes → CLS = 0.
 */
export function ListingsMap({ points, variant = "pins", ariaLabel, className = "map-shell-tall" }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const pointsKey = points.map((p) => p.id).join("|");

  // Initialisation unique
  useEffect(() => {
    let cancelled = false;
    let mq: MediaQueryList | undefined;
    let onTheme: (() => void) | undefined;

    void import("leaflet").then((L) => {
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true }).setView(JERUSALEM, 13);
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      let tiles = L.tileLayer(mq.matches ? TILES.dark : TILES.light, { attribution: ATTRIBUTION, maxZoom: 19, subdomains: "abcd" }).addTo(m);
      onTheme = () => {
        tiles.remove();
        tiles = L.tileLayer(mq!.matches ? TILES.dark : TILES.light, { attribution: ATTRIBUTION, maxZoom: 19, subdomains: "abcd" }).addTo(m);
      };
      mq.addEventListener("change", onTheme);
      // Zoom molette uniquement après interaction : pas de piège au scroll de la page.
      m.on("focus click", () => m.scrollWheelZoom.enable());
      m.on("blur mouseout", () => m.scrollWheelZoom.disable());
      map.current = m;
      layer.current = L.layerGroup().addTo(m);
      el.current.dispatchEvent(new Event("map:ready"));
    });

    return () => {
      cancelled = true;
      if (mq && onTheme) mq.removeEventListener("change", onTheme);
      map.current?.remove();
      map.current = null;
      layer.current = null;
    };
  }, []);

  // Mise à jour des marqueurs (sans recréer la carte)
  useEffect(() => {
    const node = el.current;
    if (!node) return;

    const render = (): void => {
      void import("leaflet").then((L) => {
        const m = map.current;
        const g = layer.current;
        if (!m || !g) return;
        g.clearLayers();

        if (variant === "area") {
          const p = points[0];
          if (!p) return;
          L.circle([p.lat, p.lng], { radius: 350, color: "#282e3c", weight: 1.5, fillOpacity: 0.12 }).addTo(g);
          L.marker([p.lat, p.lng], { icon: L.divIcon({ className: "", html: '<span class="area-dot"></span>', iconSize: [0, 0] }), keyboard: false, interactive: false }).addTo(g);
          m.setView([p.lat, p.lng], 15);
          return;
        }

        for (const p of points) {
          const icon = L.divIcon({
            className: "",
            html: `<span class="price-pin" data-inactive="${p.inactive ? "true" : "false"}">${escapeHtml(p.label)}</span>`,
            iconSize: [0, 0],
          });
          L.marker([p.lat, p.lng], { icon, title: p.title, alt: p.title, riseOnHover: true })
            .bindPopup(`<a href="${escapeHtml(p.href)}">${escapeHtml(p.title)}</a><br>${escapeHtml(p.label)}`)
            .addTo(g);
        }
        if (points.length > 1) m.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { padding: [48, 48], maxZoom: 15 });
        else if (points[0]) m.setView([points[0].lat, points[0].lng], 15);
      });
    };

    if (map.current) render();
    else node.addEventListener("map:ready", render, { once: true });
    return () => node.removeEventListener("map:ready", render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointsKey, variant]);

  return (
    <div className={`map-shell ${className}`}>
      <div ref={el} className="map-canvas" role="region" aria-label={ariaLabel} />
    </div>
  );
}
