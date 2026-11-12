import type { Metadata } from "next";
import { RequestForm } from "@/components/forms/RequestForm";
import { needOptions } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Tell us what you need",
  description: "Looking for a phone, charger, power bank, pouch, screen guard, speaker or repair? Tell LuckyTech what you need and get prices from our Owo or Akure store.",
};

type SP = Record<string, string | string[] | undefined>;
const str = (v: SP[string]) => (typeof v === "string" ? v.slice(0, 200) : "");

export default async function RequestPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const need = str(sp.need);
  const payment = str(sp.payment);
  return (
    <div className="relative overflow-hidden pt-32">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Request a gadget</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.75rem)]">Tell us what you need.</h1>
          <p className="mt-5 max-w-md text-lg text-mist">
            We sell much more than what’s on the site. Phones, tablets, chargers, power banks, pouches, screen guards, speakers, smartwatches, original screens and repairs. Wholesale or retail.
          </p>
          <ol className="mt-10 space-y-5">
            {[
              ["Tell us", "What you want, your budget and which store is closest."],
              ["We check", "The store checks stock and prices for you."],
              ["We reply", "You get an answer on WhatsApp or by phone, usually the same day."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-glow/15 font-display font-bold text-glow ring-1 ring-glow/30">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="block text-sm text-mist">{b}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <RequestForm
          initialNeed={(needOptions as readonly string[]).includes(need) ? need : ""}
          initialPayment={payment === "pay-later" ? "pay-later" : ""}
          initialModel={str(sp.model)}
          initialDetails={str(sp.details)}
        />
      </div>
    </div>
  );
}
