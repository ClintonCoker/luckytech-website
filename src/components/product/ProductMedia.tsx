import Image from "next/image";
import type { Product } from "@/content/products";
import { DeviceArt, isPro } from "@/components/product/DeviceArt";

/** Real photo when the product has one, otherwise the device illustration. */
export function ProductMedia({ product, view = "back", className = "", priority = false, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; view?: "back" | "front"; className?: string; priority?: boolean; sizes?: string }) {
  if (product.image) {
    return <Image src={product.image} alt={product.name} fill sizes={sizes} priority={priority} className={`object-contain ${className}`} />;
  }
  return <DeviceArt style={product.style} tint={product.tint} id={product.slug} view={view} pro={isPro(product.slug)} className={className} />;
}
