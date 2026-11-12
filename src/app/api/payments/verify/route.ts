import { NextResponse } from "next/server";
import { branchById } from "@/content/store";
import { productTitle } from "@/content/products";
import { formatNaira } from "@/lib/format";
import { priceCart } from "@/lib/pricing";
import { verifySchema } from "@/lib/schemas";
import { verifyFlutterwave, verifyPaystack } from "@/lib/payments.server";
import { sendStoreEmail } from "@/lib/email.server";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/** Called by the checkout page after Paystack or Flutterwave says the customer has paid. */
export async function POST(req: Request) {
  const parsed = verifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid order details." }, { status: 400 });
  const { provider, reference, transactionId, lines, contact, branch: branchId } = parsed.data;

  const branch = branchById(branchId);
  const priced = priceCart(lines);
  if (!branch || priced.lines.length === 0) return NextResponse.json({ ok: false, error: "Your cart is empty." }, { status: 400 });

  const result =
    provider === "paystack"
      ? await verifyPaystack(reference, priced.subtotal)
      : await verifyFlutterwave(transactionId ?? "", reference, priced.subtotal);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason ?? "Payment could not be confirmed." }, { status: 402 });
  }

  const message = orderMessage(branch, priced.lines, priced.subtotal, contact, reference);
  const items = priced.lines.map((l) => `${l.qty} × ${productTitle(l.product)} (${l.product.condition}) — ${formatNaira(l.lineTotal)}`).join("\n");
  const emailed = await sendStoreEmail(
    `Paid order ${reference}: ${formatNaira(priced.subtotal)} (${branch.city})`,
    `Paid with ${provider === "paystack" ? "Paystack" : "Flutterwave"}.\nReference: ${reference}\nBranch: ${branch.name}\n\n${items}\n\nTotal: ${formatNaira(priced.subtotal)}\n\n${message}`,
    contact.email || undefined,
  );

  return NextResponse.json({
    ok: true,
    reference,
    total: priced.subtotal,
    emailed,
    whatsappUrl: whatsappLink(branch, message),
  });
}
