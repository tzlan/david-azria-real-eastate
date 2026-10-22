import type { Metadata } from "next";
import { TransactionPage } from "@/components/TransactionPage";

export const metadata: Metadata = {
  title: "Appartements à vendre à Jérusalem",
  description: "Appartements à vendre à Jérusalem : Rehavia, Talbieh, German Colony, Baka, Katamon, Arnona… Prix, photos, carte. Agent immobilier francophone.",
  alternates: { canonical: "/acheter" },
};

export default function BuyPage() {
  return <TransactionPage tx="sale" />;
}
