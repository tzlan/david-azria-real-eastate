import { z } from "zod";

/** Schéma partagé client/serveur. */
export const ContactSchema = z
  .object({
    name: z.string().trim().min(2, "Indiquez votre nom").max(80),
    phone: z.string().trim().max(30).regex(/^[+\d\s().-]*$/, "Numéro invalide").default(""),
    email: z.union([z.literal(""), z.string().trim().email("Adresse e-mail invalide").max(120)]).default(""),
    message: z.string().trim().max(2000).default(""),
    listingSlug: z.string().max(200).optional(),
    intent: z.enum(["contact", "sell"]).default("contact"),
    /** Champ piège anti-spam : doit rester vide. */
    website: z.string().max(0).optional(),
  })
  .refine((d) => d.phone.replace(/\D/g, "").length >= 8 || d.email.length > 0, {
    message: "Indiquez un téléphone ou un e-mail",
    path: ["phone"],
  });

export type ContactInput = z.input<typeof ContactSchema>;
export type ContactFieldErrors = Partial<Record<"name" | "phone" | "email" | "message", string>>;
