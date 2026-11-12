import { branches } from "@/content/store";
import { formatPhone, telHref } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { Reveal } from "@/components/shared/Reveal";
import { IconPhone, IconPin, IconWhatsApp } from "@/components/shared/Icons";

export function BranchCards({ withMap = true }: { withMap?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {branches.map((b, i) => (
        <Reveal key={b.id} delay={i * 0.1}>
          <article className="card h-full" aria-labelledby={`branch-${b.id}`}>
            {withMap && (
              <div className="relative h-60 overflow-hidden border-b border-line bg-panel">
                <iframe
                  title={`Map of ${b.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&output=embed`}
                  className="h-full w-full grayscale-[0.4] invert-[0.92] hue-rotate-180"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <h3 id={`branch-${b.id}`} className="font-display text-2xl font-semibold">{b.name}</h3>
                {b.main && <span className="rounded-full bg-glow/15 px-2.5 py-1 text-xs font-semibold text-glow ring-1 ring-glow/30">Main store</span>}
              </div>
              <address className="mt-4 flex gap-3 not-italic text-mist">
                <IconPin className="mt-0.5 shrink-0 text-glow" />
                <span>
                  {b.address.map((a) => <span key={a} className="block">{a}</span>)}
                  <span className="block">{b.city}, {b.state}</span>
                </span>
              </address>
              <ul className="mt-4 space-y-2">
                {b.phones.map((p) => (
                  <li key={p}>
                    <a href={telHref(p)} className="inline-flex items-center gap-3 text-mist hover:text-cloud">
                      <IconPhone className="text-glow" /> <span className="tabular">{formatPhone(p)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink(b, `Hello LuckyTech ${b.city}, I have a question.`)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
                  <IconWhatsApp /> WhatsApp {b.city}
                </a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  Get directions
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
