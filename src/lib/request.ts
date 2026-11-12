import { branchById } from "@/content/store";
import type { RequestInput } from "@/lib/schemas";

const labels = {
  buyingFor: { personal: "For myself", wholesale: "Wholesale (to resell)", business: "For a business or office" },
  condition: { any: "Any", new: "Brand new", "uk-used": "UK-used" },
  payment: { full: "Pay in full", "pay-later": "Buy now, pay later (30% down)", "not-sure": "Not sure yet" },
  timeline: { today: "Today", "this-week": "This week", "this-month": "This month", "just-asking": "Just asking for prices" },
} as const;

/** Plain-text summary of a customer request, used for both the email and the WhatsApp message. */
export function requestSummary(r: RequestInput): string {
  const branch = branchById(r.branch);
  return [
    `New request for LuckyTech ${branch?.city ?? r.branch}`,
    "",
    `Looking for: ${r.needs.join(", ")}`,
    r.brandModel ? `Brand / model: ${r.brandModel}` : "",
    `Condition: ${labels.condition[r.condition]}`,
    r.quantity ? `Quantity: ${r.quantity}` : "",
    r.budget ? `Budget: ${r.budget}` : "",
    `Buying: ${labels.buyingFor[r.buyingFor]}`,
    `Payment: ${labels.payment[r.payment]}`,
    `When: ${labels.timeline[r.timeline]}`,
    "",
    `Details: ${r.details}`,
    "",
    `Name: ${r.name}`,
    `Phone: ${r.phone}`,
    r.email ? `Email: ${r.email}` : "",
  ]
    .filter((l, i, all) => l !== "" || all[i - 1] !== "")
    .join("\n")
    .trim();
}
