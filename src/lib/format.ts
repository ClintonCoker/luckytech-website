const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

/** ₦950,000 */
export function formatNaira(amount: number): string {
  return naira.format(Math.round(amount)).replace("NGN", "₦").replace(/\s/g, "");
}

/** 07036391276 → 0703 639 1276 */
export function formatPhone(local: string): string {
  const d = local.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : local;
}

/** 07036391276 → +2347036391276 */
export function telHref(local: string): string {
  const d = local.replace(/\D/g, "");
  return d.startsWith("0") ? `tel:+234${d.slice(1)}` : `tel:+${d}`;
}
