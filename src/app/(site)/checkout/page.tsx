import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { publicKeys } from "@/lib/env";
import { getCatalog } from "@/lib/catalog.server";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const catalog = await getCatalog({ fresh: true });
  return (
    <div className="wrap pt-32">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Almost yours.</h1>
      <CheckoutForm catalog={catalog} paystackKey={publicKeys.paystack} flutterwaveKey={publicKeys.flutterwave} />
    </div>
  );
}
