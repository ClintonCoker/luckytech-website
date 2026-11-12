import type { Metadata } from "next";
import Link from "next/link";
import { branches } from "@/content/store";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/shared/Reveal";
import { whatsappLink } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/shared/Icons";

export const metadata: Metadata = {
  title: "Phone repairs in under 45 minutes",
  description: "Cracked screen, charging port, battery or water damage? Get your phone fixed while you wait at LuckyTech Owo and Akure, with original screens.",
};

const repairs = [
  ["Screen replacement", "Original screens for iPhone, Samsung, Tecno, Infinix, Redmi and more."],
  ["Charging port", "Phone not charging or charging slowly? Usually a quick fix."],
  ["Battery", "Battery draining fast or swelling? We replace it safely."],
  ["Water damage", "Bring it in quickly. Don't charge it first."],
  ["Speaker & mic", "Can't hear calls or they can't hear you."],
  ["Software & unlocking", "Stuck on logo, forgotten password, updates and data transfer."],
] as const;

export default function RepairsPage() {
  return (
    <>
      <PageHero
        eyebrow="Repairs"
        title={<>Fixed in under <span className="text-signal">45 minutes.</span></>}
        body="Walk in, wait, walk out with a working phone. We tell you the price and time before we touch it, and use original parts."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/request?need=Phone%20repair" className="btn btn-red">Book a repair</Link>
          {branches.map((b) => (
            <a key={b.id} href={whatsappLink(b, `Hello LuckyTech ${b.city}, I need a phone repair. Phone model: ... Problem: ...`)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <IconWhatsApp /> {b.label}
            </a>
          ))}
        </div>
      </PageHero>
      <section className="wrap" aria-label="What we fix">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repairs.map(([t, b], i) => (
            <Reveal key={t} delay={(i % 3) * 0.06}>
              <div className="card card-glow h-full p-7">
                <span className="font-display text-sm text-glow tabular">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-5 font-display text-2xl font-semibold">{t}</h2>
                <p className="mt-2 text-mist">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
