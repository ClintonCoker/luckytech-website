"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { productTitle, stockState, type Product } from "@/content/products";
import { downPayment } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";
import { Reveal } from "@/components/shared/Reveal";

/** Buy now, pay later: shows the 30% down payment for a chosen phone. */
export function PayLater({ catalog }: { catalog: Product[] }) {
  const phones = useMemo(() => catalog.filter((p) => p.category === "smartphones" && stockState(p) !== "out").sort((a, b) => b.price - a.price), [catalog]);
  const [slug, setSlug] = useState(phones[0]?.slug ?? "");
  const p = phones.find((x) => x.slug === slug) ?? phones[0];
  if (!p) return null;
  const down = downPayment(p.price);

  return (
    <section className="wrap py-12" aria-labelledby="paylater-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-signal via-[#a3101f] to-[#3b0710] p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-white/10" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Buy now, pay later</p>
              <h2 id="paylater-title" className="display mt-4 text-[clamp(2.5rem,6vw,4.75rem)]">Take it home with <span className="whitespace-nowrap">30% down.</span></h2>
              <p className="mt-4 max-w-md text-white/80">Pay 30% today and spread the rest. Pick a phone to see your down payment.</p>
            </div>
            <div className="rounded-3xl bg-black/25 p-6 ring-1 ring-white/15 backdrop-blur sm:p-8">
              <label className="field">
                <span>Choose a phone</span>
                <select className="input !bg-black/30" value={slug} onChange={(e) => setSlug(e.target.value)}>
                  {phones.map((x) => (
                    <option key={x.slug} value={x.slug}>{productTitle(x)} ({x.condition}): {formatNaira(x.price)}</option>
                  ))}
                </select>
              </label>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">Down payment today</p>
                  <p className="font-display text-4xl font-bold tabular sm:text-5xl" aria-live="polite">{formatNaira(down)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70">Balance</p>
                  <p className="font-display text-xl font-semibold tabular">{formatNaira(p.price - down)}</p>
                </div>
              </div>
              <Link href={`/request?need=Phone&payment=pay-later&model=${encodeURIComponent(productTitle(p))}`} className="btn mt-6 w-full bg-white text-[#3b0710] hover:bg-white/90">Apply for pay later</Link>
              <p className="mt-3 text-xs text-white/60">Terms are confirmed by the store. Estimate only.</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
