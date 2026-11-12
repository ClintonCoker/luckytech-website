import Image from "next/image";

/** The official LKT mark on a white tile, so the green logo stays readable on the dark site. */
export function BrandMark({ height = 40, className = "" }: { height?: number; className?: string }) {
  const width = Math.round(height * (480 / 255));
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_-8px_rgb(25_168_79/0.9)] ${className}`} style={{ height, width }}>
      <Image src="/brand/lkt-mark.png" alt="" width={width} height={height} className="h-full w-full object-contain" priority />
    </span>
  );
}
