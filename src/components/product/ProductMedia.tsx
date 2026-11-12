import Image from "next/image";
import type { Product } from "@/content/products";
import { DeviceArt, isPro } from "@/components/product/DeviceArt";

/** The product's main photo, or a drawn device if it has no photo yet. */
export function ProductMedia({ product, className = "", priority = false, sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw", index = 0 }: { product: Product; className?: string; priority?: boolean; sizes?: string; index?: number }) {
  const src = product.images?.[index] ?? product.images?.[0];
  if (src) {
    return <Image src={src} alt={product.name} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  if (product.category === "accessories" || product.category === "gadgets") {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgb(62_224_127/0.12),transparent_60%)]">
        <div className="text-center text-mist">
          <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="m3 7.5 9 4.5 9-4.5M12 12v9" /></svg>
          <p className="mt-2 text-xs">Photo coming soon</p>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-[12%] flex items-center justify-center">
      <DeviceArt style={product.style} tint={product.tint} id={product.slug} pro={isPro(product.slug)} className="h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
