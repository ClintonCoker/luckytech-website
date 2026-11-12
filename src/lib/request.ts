import { branchById } from "@/content/store";
import type { RequestInput } from "@/lib/schemas";

/** Plain-text summary of a customer request, used for both the email and the WhatsApp message. */
export function requestSummary(r: RequestInput): string {
  const branch = branchById(r.branch);
  return [
    `New request for LuckyTech ${branch?.city ?? r.branch}`,
    "",
    `Looking for: ${r.needs.join(", ")}`,
    r.budget ? `Budget: ${r.budget}` : "",
    r.payLater ? "Payment: Buy now, pay later (30% down)" : "",
    "",
    `Details: ${r.details}`,
    "",
    `Name: ${r.name}`,
    `Phone: ${r.phone}`,
  ]
    .filter((l, i, all) => l !== "" || all[i - 1] !== "")
    .join("\n")
    .trim();
}
