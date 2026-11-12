import type { Branch } from "@/content/store";
import { productTitle } from "@/content/products";
import { formatNaira } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";

export function whatsappLink(branch: Branch, message: string): string {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`;
}

export interface OrderContact {
  name: string;
  phone: string;
  email?: string;
  fulfilment: "pickup" | "delivery";
  address?: string;
  note?: string;
}

/** Message sent to a branch when a customer orders on WhatsApp. */
export function orderMessage(branch: Branch, lines: PricedLine[], subtotal: number, c: OrderContact, reference?: string): string {
  const items = lines.map((l) => `• ${l.qty} × ${productTitle(l.product)} (${l.product.condition}) — ${formatNaira(l.lineTotal)}`);
  return [
    `Hello LuckyTech ${branch.city}, I'd like to order:`,
    "",
    ...items,
    "",
    `Total: ${formatNaira(subtotal)}`,
    reference ? `Paid online. Reference: ${reference}` : "Payment: to confirm with you",
    c.fulfilment === "pickup" ? `Pickup at: ${branch.name}` : `Delivery to: ${c.address || "(address to confirm)"}`,
    "",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    c.email ? `Email: ${c.email}` : "",
    c.note ? `Note: ${c.note}` : "",
  ]
    .filter((line, i, all) => line !== "" || (all[i - 1] ?? "") !== "")
    .join("\n")
    .trim();
}

/** Quick question about one product. */
export function productEnquiry(branch: Branch, title: string, price: string, payLater = false): string {
  return payLater
    ? `Hello LuckyTech ${branch.city}, I'm interested in buy now, pay later for the ${title} (${price}). What are the terms?`
    : `Hello LuckyTech ${branch.city}, is the ${title} (${price}) available?`;
}
