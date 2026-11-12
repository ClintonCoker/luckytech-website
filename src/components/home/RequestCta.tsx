import Link from "next/link";
import { accessoryCategories } from "@/content/store";
import { Reveal } from "@/components/shared/Reveal";
import { IconArrow } from "@/components/shared/Icons";

export function RequestCta() {
  return (
    <section className="wrap py-24 sm:py-32" aria-labelledby="request-cta-title">
      <Reveal>
        <div className="card relative overflow-hidden p-8 sm:p-14">
          <div className="aurora opacity-70" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Can’t see it? We’ll find it.</p>
              <h2 id="request-cta-title" className="display mt-4 text-[clamp(2.2rem,5vw,4rem)]">Tell us what you need.</h2>
              <p className="mt-4 max-w-lg text-lg text-mist">We stock far more than what’s online: chargers, pouches, screen guards, power banks, speakers, smartwatches, parts and more. Fill a quick form and the store gets back to you with prices.</p>
              <Link href="/request" className="btn btn-primary mt-8">Start a request <IconArrow /></Link>
            </div>
            <ul className="flex flex-wrap gap-2">
              {accessoryCategories.map((c) => (
                <li key={c.id}>
                  <Link href={`/request?need=${encodeURIComponent(c.need)}`} className="chip">{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
