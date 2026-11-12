import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-32">
      <p className="eyebrow">Cart</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Your cart</h1>
      <CartView />
    </div>
  );
}
