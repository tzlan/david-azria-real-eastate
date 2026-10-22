import { z } from "zod";
import { NEIGHBORHOOD_SLUGS } from "./neighborhoods";

export const PROPERTY_TYPES = {
  apartment: "Appartement",
  "garden-apartment": "Rez-de-jardin",
  penthouse: "Penthouse",
  duplex: "Duplex",
  house: "Maison",
  cottage: "Cottage",
  studio: "Studio",
} as const;

export const FEATURES = {
  elevator: "Ascenseur",
  "shabbat-elevator": "Ascenseur de Chabbat",
  parking: "Parking",
  mamad: "Mamad",
  balcony: "Balcon",
  "sukkah-balcony": "Balcon soukka",
  garden: "Jardin",
  storage: "Débarras",
  view: "Vue dégagée",
  renovated: "Rénové",
  "air-conditioning": "Climatisation",
  furnished: "Meublé",
  accessible: "Accessible PMR",
  "new-build": "Neuf",
} as const;

export const ListingImageSchema = z.object({
  src: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const ListingSchema = z.object({
  id: z.string(),
  slug: z.string(),
  demo: z.boolean().optional(),
  status: z.enum(["available", "under-offer", "sold", "rented"]),
  transaction: z.enum(["sale", "rent"]),
  propertyType: z.enum(Object.keys(PROPERTY_TYPES) as [keyof typeof PROPERTY_TYPES, ...(keyof typeof PROPERTY_TYPES)[]]),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  price: z.number().positive().nullable(),
  rooms: z.number().positive().nullable(),
  surface: z.number().positive().nullable(),
  floor: z.number().int().nullable(),
  totalFloors: z.number().int().positive().nullable(),
  neighborhood: z.enum(NEIGHBORHOOD_SLUGS),
  street: z.string().nullable(),
  features: z.array(z.enum(Object.keys(FEATURES) as [keyof typeof FEATURES, ...(keyof typeof FEATURES)[]])),
  images: z.array(ListingImageSchema),
  lat: z.number(),
  lng: z.number(),
  sourceUrl: z.string().url(),
  publishedAt: z.string(),
  updatedAt: z.string(),
});

export type Listing = z.infer<typeof ListingSchema>;
export type ListingImage = z.infer<typeof ListingImageSchema>;
export type PropertyType = Listing["propertyType"];
export type Feature = Listing["features"][number];
export type Transaction = Listing["transaction"];
export type ListingStatus = Listing["status"];

export const ListingsFileSchema = z.object({
  syncedAt: z.string().nullable(),
  listings: z.array(ListingSchema),
});
export type ListingsFile = z.infer<typeof ListingsFileSchema>;
