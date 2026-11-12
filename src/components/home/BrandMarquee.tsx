import { brands } from "@/content/store";

export function BrandMarquee() {
  const row = [...brands, ...brands];
  return (
    <section aria-label="Brands we sell" className="relative border-y border-line bg-deep/60 py-6">
      <div className="marquee-mask overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14">
          {[...row, ...row].map((b, i) => (
            <li key={i} aria-hidden={i >= brands.length} className="flex items-center gap-14 font-display text-2xl font-semibold tracking-tight text-white/40 sm:text-3xl">
              {b}
              <span className="h-2 w-2 rounded-full bg-glow/50" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
