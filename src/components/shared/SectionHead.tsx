import type { ReactNode } from "react";
import { Reveal } from "@/components/shared/Reveal";

export function SectionHead({ eyebrow, title, body, action, id }: { eyebrow: string; title: ReactNode; body?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="display mt-4 text-[clamp(2.1rem,5vw,3.75rem)]">{title}</h2>
        {body && <p className="mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg">{body}</p>}
      </div>
      {action}
    </Reveal>
  );
}
