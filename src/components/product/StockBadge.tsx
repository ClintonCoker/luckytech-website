import { stockState, type Product } from "@/content/products";

/** "Sold out" or "Only 3 left". Shows nothing when there's plenty or stock isn't tracked. */
export function StockBadge({ product, className = "" }: { product: Pick<Product, "stock">; className?: string }) {
  const s = stockState(product);
  if (s === "out") return <span className={`rounded-full bg-cloud/90 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-night ${className}`}>Sold out</span>;
  if (s === "low") return <span className={`rounded-full bg-[#ffb020] px-2.5 py-1 text-[0.7rem] font-bold text-[#2a1a00] ${className}`}>Only {product.stock} left</span>;
  return null;
}
