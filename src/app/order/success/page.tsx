import type { Metadata } from "next";
import { OrderSuccess } from "@/components/cart/OrderSuccess";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function SuccessPage() {
  return (
    <div className="wrap pt-32">
      <OrderSuccess />
    </div>
  );
}
