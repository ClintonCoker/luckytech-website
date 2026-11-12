import Link from "next/link";
import { services } from "@/content/store";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/Reveal";
import { IconBolt, IconShield, IconWrench } from "@/components/shared/Icons";

const icons: Record<string, React.ReactNode> = {
  repair: <IconWrench />,
  phones: <IconShield />,
  screens: <IconBolt />,
};

export function Services() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead id="services-title" eyebrow="Why LuckyTech" title={<>More than a phone shop.</>} body="Sales, repairs, parts and wholesale, from one team you can actually walk in and talk to." />
        <div className="grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-6">
          {services.map((s, i) => {
            const big = s.id === "repair";
            const wide = s.id === "paylater";
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.08} className={big ? "md:col-span-3 md:row-span-2" : wide ? "md:col-span-3" : "md:col-span-3 lg:col-span-2"}>
                <div className={`card card-glow flex h-full flex-col justify-between gap-6 p-7 ${big ? "bg-[radial-gradient(circle_at_80%_10%,rgb(227_25_44/0.25),transparent_50%),linear-gradient(180deg,var(--color-panel-2),var(--color-panel))]" : ""}`}>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-glow/10 text-glow ring-1 ring-glow/30">{icons[s.id] ?? <IconBolt />}</span>
                  <div>
                    {big && <p className="display text-[clamp(4rem,9vw,7.5rem)] text-white">45<span className="text-signal">min</span></p>}
                    <h3 className={`font-display font-semibold ${big ? "text-3xl" : "text-xl"}`}>{s.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-mist sm:text-base">{s.body}</p>
                    {big && <Link href="/repairs" className="btn btn-red mt-6">Book a repair</Link>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
