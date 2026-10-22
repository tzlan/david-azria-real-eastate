/**
 * Génère des visuels de démonstration (façades en pierre de Jérusalem stylisées).
 * Supprimés automatiquement au premier sync Facebook réel.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const W = 1600;
const H = 1100;

const PALETTES = [
  { sky: ["#bcd7ee", "#f3e9dc"], stone: "#e4d3b6", shade: "#cdb791", glass: "#5b6f80" },
  { sky: ["#f6c9a8", "#fbeee0"], stone: "#ead8bb", shade: "#d1b78f", glass: "#4a5560" },
  { sky: ["#a9c8e4", "#e9eef3"], stone: "#ddcaa8", shade: "#c2a77d", glass: "#3f5468" },
  { sky: ["#c9d6e3", "#f5efe6"], stone: "#efe2c9", shade: "#d8c19a", glass: "#56687a" },
  { sky: ["#f2d4b8", "#f7ebe0"], stone: "#e2cfae", shade: "#c9ad82", glass: "#4b5c6b" },
  { sky: ["#b3cde0", "#eef2f5"], stone: "#e8d9bd", shade: "#cfb68c", glass: "#455a6d" },
] as const;

function rng(seed: number): () => number {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function facade(seed: number, variant: number): string {
  const p = PALETTES[seed % PALETTES.length]!;
  const r = rng(seed * 31 + variant * 7 + 1);
  const floors = 3 + Math.floor(r() * 3);
  const cols = 4 + Math.floor(r() * 3);
  const bx = 160 + r() * 120;
  const bw = W - bx * 2;
  const top = 260 - variant * 40;
  const bh = H - top - 120;
  const fh = bh / floors;
  const cw = bw / cols;
  let windows = "";
  for (let f = 0; f < floors; f++) {
    for (let c = 0; c < cols; c++) {
      const ww = cw * 0.46;
      const wh = fh * 0.58;
      const x = bx + c * cw + (cw - ww) / 2;
      const y = top + f * fh + fh * 0.2;
      const lit = r() > 0.82 ? "#f4d9a1" : p.glass;
      windows += `<path d="M${x} ${y + wh} V${y + ww / 2} A${ww / 2} ${ww / 2} 0 0 1 ${x + ww} ${y + ww / 2} V${y + wh} Z" fill="${lit}" opacity="0.9"/>`;
      windows += `<rect x="${x - 6}" y="${y + wh}" width="${ww + 12}" height="8" fill="${p.shade}"/>`;
    }
    windows += `<rect x="${bx}" y="${top + (f + 1) * fh - 6}" width="${bw}" height="6" fill="${p.shade}" opacity="0.6"/>`;
  }
  let trees = "";
  for (let i = 0; i < 5; i++) {
    const tx = r() * W;
    const tr = 60 + r() * 90;
    trees += `<circle cx="${tx}" cy="${H - 90}" r="${tr}" fill="#6f8a5e" opacity="${0.55 + r() * 0.3}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.stone}"/><stop offset="1" stop-color="${p.shade}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect x="${bx}" y="${top}" width="${bw}" height="${bh}" fill="url(#stone)"/>
  <rect x="${bx - 20}" y="${top - 18}" width="${bw + 40}" height="18" fill="${p.shade}"/>
  ${windows}
  ${trees}
  <rect y="${H - 70}" width="${W}" height="70" fill="#cbbfae"/>
</svg>`;
}

async function main(): Promise<void> {
  const out = path.resolve("public/photos");
  for (let i = 1; i <= 6; i++) {
    const dir = path.join(out, `demo-${i}`);
    await mkdir(dir, { recursive: true });
    for (let v = 0; v < 3; v++) {
      await sharp(Buffer.from(facade(i, v)))
        .blur(1.2)
        .webp({ quality: 78 })
        .toFile(path.join(dir, `${v + 1}.webp`));
    }
  }
  console.log("✓ visuels de démo générés");
}

void main();
