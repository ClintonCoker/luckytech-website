import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";

/** LuckyTech logo: the official LKT mark plus the name. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="LuckyTech home">
      <BrandMark height={40} className="ring-1 ring-cloud/20 transition group-hover:ring-glow/60" />
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight">LuckyTech</span>
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mist">Communications</span>
      </span>
    </Link>
  );
}
