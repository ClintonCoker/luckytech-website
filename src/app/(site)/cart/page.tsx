import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { getCatalog } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const catalog = await getCatalog({ fresh: true });
  return (
    <div className="wrap pt-32">
      <p className="eyebrow">Cart</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Your cart</h1>
      <CartView catalog={catalog} />
    </div>
  );
}
