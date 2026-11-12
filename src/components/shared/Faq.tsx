import { faqs } from "@/content/store";

export function Faq() {
  return (
    <div className="divide-y divide-line rounded-3xl border border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group px-6 py-5 sm:px-8 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ring-white/15 transition-transform duration-300 group-open:rotate-45 group-open:bg-glow/15 group-open:text-glow">+</span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-mist">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
