import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { ContactSchema } from "@/lib/contact";
import { getListing } from "@/lib/listings";
import { absoluteUrl } from "@/lib/site";
import { formatFloor, formatNumber, formatPrice, formatRooms } from "@/lib/format";
import { neighborhoodName } from "@/lib/neighborhoods";

export const runtime = "nodejs";

/** Limiteur best-effort par instance : 5 envois / 10 min / IP. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const row = (k: string, v: string): string =>
  `<tr><td style="padding:6px 16px 6px 0;color:#6e6e73;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#1d1d1f;font-weight:600">${v}</td></tr>`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Trop de demandes" }, { status: 429 });

  const parsed = ContactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const lead = parsed.data;
  if (lead.website) return NextResponse.json({ ok: true }); // bot : on fait semblant

  const { RESEND_API_KEY, AGENT_EMAIL, MAIL_FROM } = process.env;
  if (!RESEND_API_KEY || !AGENT_EMAIL || !MAIL_FROM) {
    console.error("[contact] Variables RESEND_API_KEY / AGENT_EMAIL / MAIL_FROM manquantes");
    return NextResponse.json({ error: "Configuration" }, { status: 500 });
  }

  const l = lead.listingSlug ? getListing(lead.listingSlug) : undefined;
  const listingUrl = l ? absoluteUrl(`/biens/${l.slug}`) : null;
  const subject = l
    ? `🏠 Nouveau lead — ${l.title} (${formatPrice(l)})`
    : lead.intent === "sell"
      ? `🔑 Demande d’estimation — ${lead.name}`
      : `🏠 Nouveau lead — ${lead.name}`;
  const waNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "972");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:18px;padding:28px;border:1px solid #e5e5ea">
    <p style="margin:0 0 4px;font-size:13px;color:#6e6e73">${lead.intent === "sell" ? "Vendeur / bailleur : demande d’estimation" : "Nouveau contact depuis le site"}</p>
    <h1 style="margin:0 0 20px;font-size:24px;color:#1d1d1f">${esc(lead.name)}</h1>
    <table style="border-collapse:collapse;font-size:15px">
      ${lead.phone ? row("Téléphone", `<a href="tel:${esc(lead.phone)}" style="color:#0058c4">${esc(lead.phone)}</a>${waNumber.length >= 11 ? ` · <a href="https://wa.me/${waNumber}" style="color:#1b6b34">WhatsApp</a>` : ""}`) : ""}
      ${lead.email ? row("E-mail", `<a href="mailto:${esc(lead.email)}" style="color:#0058c4">${esc(lead.email)}</a>`) : ""}
    </table>
    ${lead.message ? `<p style="margin:20px 0 0;padding:16px;background:#f5f5f7;border-radius:12px;font-size:15px;line-height:1.5;color:#1d1d1f;white-space:pre-wrap">${esc(lead.message)}</p>` : ""}
  </div>
  ${
    l && listingUrl
      ? `<div style="background:#fff;border-radius:18px;margin-top:16px;overflow:hidden;border:1px solid #e5e5ea">
    ${l.images[0] ? `<img src="${absoluteUrl(l.images[0].src)}" alt="" width="560" style="display:block;width:100%;height:auto">` : ""}
    <div style="padding:24px 28px">
      <p style="margin:0 0 4px;font-size:13px;color:#6e6e73">Bien concerné</p>
      <h2 style="margin:0 0 4px;font-size:20px;color:#1d1d1f">${esc(l.title)}</h2>
      <p style="margin:0 0 16px;font-size:20px;font-weight:700;color:#282e3c">${esc(formatPrice(l))}</p>
      <table style="border-collapse:collapse;font-size:15px">
        ${row("Quartier", esc(neighborhoodName(l.neighborhood)))}
        ${l.rooms !== null ? row("Pièces", formatRooms(l.rooms)) : ""}
        ${l.surface !== null ? row("Surface", `${formatNumber(l.surface)} m²`) : ""}
        ${l.floor !== null ? row("Étage", formatFloor(l.floor, l.totalFloors)) : ""}
      </table>
      <p style="margin:20px 0 0"><a href="${listingUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#282e3c;color:#fff;text-decoration:none;font-weight:600">Voir l’annonce</a>
      &nbsp;<a href="${esc(l.sourceUrl)}" style="color:#0058c4;font-size:14px">Post Facebook</a></p>
    </div>
  </div>`
      : ""
  }
</div></body></html>`;

  const text = [
    `Nouveau lead : ${lead.name}`,
    lead.phone && `Téléphone : ${lead.phone}`,
    lead.email && `E-mail : ${lead.email}`,
    lead.message && `\n${lead.message}`,
    l && `\nBien : ${l.title} — ${formatPrice(l)}\n${listingUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: MAIL_FROM,
    to: AGENT_EMAIL,
    replyTo: lead.email || undefined,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[contact] Resend :", error);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
