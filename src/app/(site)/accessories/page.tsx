import type { Metadata } from "next";
import Link from "next/link";
import { accessoryCategories, branches } from "@/content/store";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { whatsappLink } from "@/lib/whatsapp";
import { IconArrow, IconWhatsApp } from "@/components/shared/Icons";

export const metadata: Metadata = {
  title: "Accessories & gadgets",
  description: "Chargers, cables, power banks, pouches, screen guards, JBL and Zealot speakers, earbuds, smartwatches and original phone screens at LuckyTech Owo and Akure. Wholesale and retail.",
};

export default function AccessoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessories & gadgets"
        title={<>Everything your phone <span className="text-gradient">needs next.</span></>}
        body="Our shelves change every week, so prices are confirmed by the store. Pick what you need and we'll send prices on WhatsApp. Wholesale and retail."
      />
      <section className="wrap" aria-label="Accessory categories">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accessoryCategories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 0.06}>
              <div className="card card-glow flex h-full flex-col p-6">
                <span className="font-display text-sm text-glow tabular">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 font-display text-2xl font-semibold">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-mist">{c.note}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link href={`/request?need=${encodeURIComponent(c.need)}`} className="btn btn-primary btn-sm">Get prices <IconArrow /></Link>
                  <a href={whatsappLink(branches[0], `Hello LuckyTech, what ${c.title.toLowerCase()} do you have in stock and at what prices?`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" aria-label={`Ask about ${c.title} on WhatsApp`}>
                    <IconWhatsApp />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
