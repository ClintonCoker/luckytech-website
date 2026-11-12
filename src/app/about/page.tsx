import type { Metadata } from "next";
import { services, store, promises } from "@/content/store";
import { PageHero } from "@/components/shared/PageHero";
import { Faq } from "@/components/shared/Faq";
import { Reveal } from "@/components/shared/Reveal";

export const metadata: Metadata = { title: "About & FAQ", description: store.description };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About LuckyTech" title={<>{store.tagline}</>} body={store.description} />
      <section className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="At a glance">
        {promises.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.06}>
            <div className="card h-full p-6">
              <p className="display text-4xl text-glow">{p.value}</p>
              <p className="mt-2 text-mist">{p.label}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="wrap mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="What we do">
        {services.map((s) => (
          <div key={s.id} className="rounded-3xl border border-line p-6">
            <h2 className="font-display text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-mist">{s.body}</p>
          </div>
        ))}
      </section>
      <section className="wrap mt-24" aria-labelledby="faq-title">
        <h2 id="faq-title" className="display mb-8 text-[clamp(2rem,5vw,3.25rem)]">Frequently asked</h2>
        <Faq />
      </section>
    </>
  );
}
