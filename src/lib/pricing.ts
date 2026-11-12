import type { Product } from "@/content/products";

export interface CartLine {
  slug: string;
  qty: number;
}

export interface PricedLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

export interface CartIssue {
  slug: string;
  name: string;
  /** "gone": no longer sold. "soldout": none left. "reduced": fewer left than requested. */
  kind: "gone" | "soldout" | "reduced";
  available?: number;
}

export const MAX_QTY = 20;

/** Most a customer can add of one product: stock if tracked, else MAX_QTY. */
export function maxQty(p: Pick<Product, "stock">): number {
  return p.stock == null ? MAX_QTY : Math.max(0, Math.min(MAX_QTY, p.stock));
}

/**
 * Prices a cart from a product list (the live catalogue on the server).
 * Unknown, hidden or sold-out products are dropped and quantities are
 * capped at what's in stock, so a tampered or stale cart can't change the price.
 */
export function priceCart(lines: readonly CartLine[], catalog: readonly Product[]): { lines: PricedLine[]; subtotal: number; count: number; issues: CartIssue[] } {
  const out: PricedLine[] = [];
  const issues: CartIssue[] = [];
  for (const l of lines) {
    const product = catalog.find((p) => p.slug === l.slug);
    const qty = Math.floor(Number(l.qty));
    if (!Number.isFinite(qty) || qty < 1) continue;
    if (!product || product.active === false) {
      issues.push({ slug: l.slug, name: product?.name ?? "An item", kind: "gone" });
      continue;
    }
    const cap = maxQty(product);
    if (cap === 0) {
      issues.push({ slug: l.slug, name: product.name, kind: "soldout" });
      continue;
    }
    const q = Math.min(qty, cap);
    if (q < qty && product.stock != null) issues.push({ slug: l.slug, name: product.name, kind: "reduced", available: q });
    out.push({ product, qty: q, lineTotal: product.price * q });
  }
  return {
    lines: out,
    subtotal: out.reduce((s, l) => s + l.lineTotal, 0),
    count: out.reduce((s, l) => s + l.qty, 0),
    issues,
  };
}

/** Down payment for buy now, pay later (30%), rounded up to the nearest ₦100. */
export function downPayment(price: number, rate = 0.3): number {
  return Math.ceil((price * rate) / 100) * 100;
}
