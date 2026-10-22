"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ContactSchema, type ContactFieldErrors } from "@/lib/contact";

interface Props {
  listingSlug?: string;
  defaultMessage?: string;
  /** Vendeur : libellé du bouton et type de demande. */
  intent?: "contact" | "sell";
}

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const Check = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="m15 24.5 6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ContactForm({ listingSlug, defaultMessage = "", intent = "contact" }: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = ContactSchema.safeParse({ ...data, listingSlug, intent });

    if (!parsed.success) {
      const next: ContactFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!res.ok) throw new Error();
      setState({ kind: "sent" });
    } catch {
      setState({ kind: "error", message: "L’envoi a échoué. Réessayez ou contactez-nous par WhatsApp." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={(n) => n?.focus()}>
        <Check />
        <h3>Message envoyé</h3>
        <p>David vous recontacte très rapidement.</p>
      </div>
    );
  }

  const field = (name: keyof ContactFieldErrors) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
  });
  const err = (name: keyof ContactFieldErrors) =>
    errors[name] ? <span id={`${uid}-${name}-err`} className="field-error">{errors[name]}</span> : null;

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-busy={state.kind === "sending"}>
      <div className="field">
        <label htmlFor={`${uid}-name`}>Nom</label>
        <input {...field("name")} className="input" autoComplete="name" required />
        {err("name")}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-phone`}>Téléphone <span className="hint">(WhatsApp de préférence)</span></label>
        <input {...field("phone")} className="input" type="tel" inputMode="tel" autoComplete="tel" />
        {err("phone")}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-email`}>E-mail</label>
        <input {...field("email")} className="input" type="email" autoComplete="email" />
        {err("email")}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea {...field("message")} className="input" defaultValue={defaultMessage} rows={4} placeholder={intent === "sell" ? "Adresse ou quartier, nombre de pièces, surface, étage…" : undefined} />
        {err("message")}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Ne pas remplir</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Envoi…" : intent === "sell" ? "Demander une estimation" : "Être recontacté"}
      </button>
      <p className="form-status" role="alert" data-state={state.kind}>
        {state.kind === "error" ? state.message : ""}
      </p>
      <p className="form-legal">Vos coordonnées sont transmises uniquement à David Azria pour répondre à votre demande.</p>
    </form>
  );
}
