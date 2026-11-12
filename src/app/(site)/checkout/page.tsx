import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { publicKeys } from "@/lib/env";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="wrap pt-32">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Almost yours.</h1>
      <CheckoutForm paystackKey={publicKeys.paystack} flutterwaveKey={publicKeys.flutterwave} />
    </div>
  );
}
