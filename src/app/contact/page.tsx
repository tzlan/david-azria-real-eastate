import type { Metadata } from "next";
import { AgentPanel } from "@/components/AgentPanel";
import { PlainHero } from "@/components/blocks";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${SITE.agentName}, ${SITE.name} : WhatsApp ${SITE.phone}. Achat, vente et location d’appartements à Jérusalem.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PlainHero eyebrow={SITE.name} title="Parlons de votre projet." lead="Achat, location ou vente à Jérusalem : David vous répond personnellement, en français." />
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="rise" style={{ ["--rd" as string]: 3 }}>
            <AgentPanel />
          </div>
        </div>
      </section>
    </>
  );
}
