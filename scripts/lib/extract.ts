import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { NEIGHBORHOODS, NEIGHBORHOOD_SLUGS } from "../../src/lib/neighborhoods";
import { FEATURES, PROPERTY_TYPES } from "../../src/lib/types";

type Keys<T> = [keyof T & string, ...(keyof T & string)[]];

export const ExtractionSchema = z.object({
  isListing: z.boolean().describe("true uniquement si le post présente un bien immobilier précis à vendre ou à louer"),
  status: z.enum(["available", "under-offer", "sold", "rented"]),
  transaction: z.enum(["sale", "rent"]),
  propertyType: z.enum(Object.keys(PROPERTY_TYPES) as Keys<typeof PROPERTY_TYPES>),
  price: z.number().nullable().describe("En shekels (ILS). Mensuel si location. null si absent."),
  rooms: z.number().nullable().describe("Nombre de pièces à l'israélienne (ex. 3.5). null si absent."),
  surface: z.number().nullable().describe("m² habitables. null si absent."),
  floor: z.number().int().nullable().describe("0 = rez-de-chaussée. null si absent."),
  totalFloors: z.number().int().nullable(),
  neighborhood: z.enum(NEIGHBORHOOD_SLUGS).describe("Quartier le plus proche dans la liste. 'jerusalem' si inconnu."),
  street: z.string().nullable().describe("Nom de rue s'il est cité, sinon null. Jamais de numéro."),
  features: z.array(z.enum(Object.keys(FEATURES) as Keys<typeof FEATURES>)),
  summary: z.string().describe("Accroche en français, 1 phrase, 150 caractères max, factuelle, sans emoji."),
  description: z
    .string()
    .describe("Annonce réécrite en français soigné, 2 à 4 paragraphes séparés par une ligne vide. Aucun emoji, aucun numéro de téléphone, aucun hashtag. N'invente rien."),
});
export type Extraction = z.infer<typeof ExtractionSchema>;

const SYSTEM = `Tu transformes les posts Facebook d'un agent immobilier de Jérusalem en annonces structurées.
Les posts peuvent être en français, hébreu ou anglais. Tu réponds toujours en français.

Règles :
- N'invente aucune information. Champ absent → null.
- "חדרים" = pièces. "ממ״ד" = mamad. "מעלית שבת" = ascenseur de Chabbat. "סוכה" = balcon soukka. "חניה" = parking. "מחסן" = débarras.
- Prix : convertis "2.9M", "2,900,000", "2.9 מיליון" en nombre (2900000). Un prix en dollars ou euros → null.
- Statut : "vendu", "נמכר", "sold" → sold ; "loué", "הושכר" → rented ; "sous offre", "en négociation" → under-offer.
- Quartiers connus : ${NEIGHBORHOOD_SLUGS.map((s) => `${s} (${NEIGHBORHOODS[s].name})`).join(", ")}.
- Un post de vœux, de conseils ou de pub générale → isListing=false (remplis les autres champs au hasard, ils seront ignorés).`;

export async function extractListing(client: Anthropic, model: string, message: string): Promise<Extraction> {
  const res = await client.messages.create({
    model,
    max_tokens: 2000,
    system: SYSTEM,
    tools: [
      {
        name: "save_listing",
        description: "Enregistre l'annonce extraite du post.",
        input_schema: z.toJSONSchema(ExtractionSchema) as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: "save_listing" },
    messages: [{ role: "user", content: `Post Facebook :\n"""\n${message}\n"""` }],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("Réponse IA sans extraction");
  return ExtractionSchema.parse(block.input);
}
