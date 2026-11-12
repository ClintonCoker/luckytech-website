import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { BranchCards } from "@/components/shared/BranchCards";

export const metadata: Metadata = {
  title: "Our stores in Owo and Akure",
  description: "Visit LuckyTech: main store at No 12 Idimisas Street, adjacent Chicken Republic, Ijebu, Owo, and our Akure branch at Olukayode House, Oshinle Roundabout.",
};

export default function BranchesPage() {
  return (
    <>
      <PageHero eyebrow="Stores" title={<>Come and see us.</>} body="Test the phone in your hand before you buy, or get a repair while you wait. Our main store is in Owo, with a branch in Akure." />
      <section className="wrap" aria-label="Store locations">
        <BranchCards />
      </section>
    </>
  );
}
