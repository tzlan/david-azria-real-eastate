import type { Metadata } from "next";
import { Breadcrumb, CtaBand, Faq, PageHero } from "@/components/blocks";
import { ContactForm } from "@/components/ContactForm";
import { PHOTOS } from "@/content/photos";

export const metadata: Metadata = {
  title: "Vendre ou louer son appartement à Jérusalem",
  description: "Vendez ou louez votre appartement à Jérusalem avec King David Immobilier : estimation, photos, diffusion auprès d’acheteurs francophones, accompagnement jusqu’à la signature.",
  alternates: { canonical: "/vendre" },
};

const STEPS = [
  { title: "Estimation", text: "Une visite et une estimation fondée sur les ventes réelles du quartier, pas sur des prix d’annonce." },
  { title: "Mise en valeur", text: "Photos soignées, annonce rédigée en français, hébreu et anglais." },
  { title: "Diffusion", text: "Publication sur ce site, sur Facebook et auprès de notre fichier d’acheteurs francophones." },
  { title: "Visites", text: "Acheteurs qualifiés uniquement : budget et financement vérifiés en amont." },
  { title: "Signature", text: "Négociation, coordination avec les avocats, suivi jusqu’à la remise des clés." },
];

const FAQ = [
  { q: "Combien coûte la mise en vente ?", a: "Rien avant la vente. Les honoraires sont dus uniquement en cas de succès et fixés ensemble dès le départ." },
  { q: "Je vis en France, pouvez-vous gérer la vente à distance ?", a: "Oui. Visites, signature par procuration via votre avocat, suivi régulier par WhatsApp : vous n’avez pas besoin d’être sur place." },
  { q: "Gérez-vous aussi la location ?", a: "Oui. Recherche de locataires, vérification des garanties, rédaction du bail avec un avocat et état des lieux." },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        photo={PHOTOS.greenDoor}
        eyebrow="Propriétaires"
        title="Vendre ou louer votre appartement à Jérusalem"
        sub="Une estimation juste, une mise en valeur soignée et un réseau d’acheteurs francophones prêts à visiter."
        crumbs={<Breadcrumb items={[{ href: "/", label: "Accueil" }, { label: "Vendre" }]} />}
      />

      <section className="section" aria-labelledby="sell-title">
        <div className="container split" style={{ alignItems: "start" }}>
          <div>
            <p className="eyebrow reveal">Notre méthode</p>
            <h2 id="sell-title" className="h2 reveal" style={{ margin: "18px 0 40px" }}>Vendre au juste prix, sans perdre de temps.</h2>
            <ol className="check-list" style={{ listStyle: "none" }}>
              {STEPS.map((s, i) => (
                <li key={s.title} className="reveal" style={{ display: "block", ["--rd" as string]: i }}>
                  <span className="pillar-num">0{i + 1}</span>
                  <h3 className="h3" style={{ margin: "8px 0 6px" }}>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="aside-sticky reveal">
            <section className="panel" aria-labelledby="estimate-title">
              <h2 id="estimate-title" className="h3" style={{ marginBottom: 8 }}>Demander une estimation</h2>
              <p className="muted" style={{ marginBottom: 24, fontSize: 15 }}>Gratuite et sans engagement. Réponse sous 24 h.</p>
              <ContactForm intent="sell" />
            </section>
          </div>
        </div>
      </section>

      <div className="section-alt"><Faq items={FAQ} title="Vendre avec King David Immobilier" /></div>
      <CtaBand photo={PHOTOS.dusk} title="Parlons de votre bien." whatsappText="Bonjour David, je souhaite vendre / louer mon appartement." />
    </>
  );
}
