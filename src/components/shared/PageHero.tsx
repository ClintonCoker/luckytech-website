import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, body, children }: { eyebrow: string; title: ReactNode; body?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36">
      <div className="aurora" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <div className="wrap relative">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)]">{title}</h1>
        {body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">{body}</p>}
        {children}
      </div>
    </section>
  );
}
