import { productBySlug, type Product } from "@/content/products";

export interface CartLine {
  slug: string;
  qty: number;
}

export interface PricedLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

export const MAX_QTY = 20;

/** Prices a cart from the catalogue. Unknown products and bad quantities are dropped, so a tampered cart can't change the price. */
export function priceCart(lines: readonly CartLine[]): { lines: PricedLine[]; subtotal: number; count: number } {
  const out: PricedLine[] = [];
  for (const l of lines) {
    const product = productBySlug(l.slug);
    const qty = Math.floor(Number(l.qty));
    if (!product || !Number.isFinite(qty) || qty < 1) continue;
    const q = Math.min(qty, MAX_QTY);
    out.push({ product, qty: q, lineTotal: product.price * q });
  }
  return {
    lines: out,
    subtotal: out.reduce((s, l) => s + l.lineTotal, 0),
    count: out.reduce((s, l) => s + l.qty, 0),
  };
}

/** Down payment for buy now, pay later (30%), rounded up to the nearest ₦100. */
export function downPayment(price: number, rate = 0.3): number {
  return Math.ceil((price * rate) / 100) * 100;
}
