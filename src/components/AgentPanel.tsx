import Image from "next/image";
import { ContactForm } from "./ContactForm";
import { Phone, WhatsApp } from "./icons";
import { SITE, telUrl, whatsappUrl } from "@/lib/site";

interface Props {
  listingSlug?: string;
  listingTitle?: string;
  listingUrl?: string;
  /** Contexte libre (ex. "Recherche à Rehavia") pour pré-remplir le message. */
  context?: string;
}

export function AgentPanel({ listingSlug, listingTitle, listingUrl, context }: Props) {
  const waText = listingTitle
    ? `Bonjour David, je suis intéressé(e) par « ${listingTitle} » : ${listingUrl ?? ""}`
    : context
      ? `Bonjour David, ${context.charAt(0).toLowerCase()}${context.slice(1)} :`
      : "Bonjour David,";
  const defaultMessage = listingTitle
    ? `Bonjour, je suis intéressé(e) par « ${listingTitle} ». Est-il possible de le visiter ?`
    : context
      ? `${context} : `
      : "";

  return (
    <section className="panel" aria-labelledby="agent-panel-title">
      <div className="panel-agent">
        <Image src="/logo.png" alt="" width={60} height={60} />
        <div>
          <strong id="agent-panel-title">{SITE.agentName}</strong>
          <span>{SITE.name} · Français, hébreu, anglais</span>
        </div>
      </div>
      <div className="btn-row">
        <a className="btn btn-whatsapp" href={whatsappUrl(waText)} target="_blank" rel="noopener">
          <WhatsApp width={18} height={18} /> WhatsApp<span className="sr-only"> (nouvel onglet)</span>
        </a>
        <a className="btn btn-ghost" href={telUrl()}>
          <Phone /> Appeler<span className="sr-only"> le {SITE.phone}</span>
        </a>
      </div>
      <div className="or-divider">ou laissez un message</div>
      <ContactForm listingSlug={listingSlug} defaultMessage={defaultMessage} />
    </section>
  );
}
