import Link from "next/link";

/** LuckyTech mark. Swap for the official logo file when available (put it in public/brand/). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="LuckyTech home">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand font-display text-[0.95rem] font-extrabold tracking-tight text-white shadow-[0_8px_24px_-8px_rgb(25_168_79/0.9)]">
        <span>L<span className="text-signal-soft">K</span>T</span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 transition group-hover:ring-glow/60" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight">LuckyTech</span>
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mist">Communications</span>
      </span>
    </Link>
  );
}
