import type { Metadata } from "next";
import { TransactionPage } from "@/components/TransactionPage";

export const metadata: Metadata = {
  title: "Appartements à louer à Jérusalem",
  description: "Locations d’appartements à Jérusalem, meublés ou vides : Nachlaot, centre-ville, Rehavia, German Colony… Agent francophone, visites rapides.",
  alternates: { canonical: "/louer" },
};

export default function RentPage() {
  return <TransactionPage tx="rent" />;
}
