import "server-only";
import { products as starter, type Product } from "@/content/products";
import { dbConfigured, dbSettings, rowToProduct, type ProductRow } from "@/lib/db.server";

export const CATALOG_TAG = "catalog";

/**
 * Every product, including hidden ones. Reads the database when it's set up
 * (cached, refreshed whenever the admin saves), otherwise the starter list.
 * `fresh: true` skips the cache, for prices and stock at checkout.
 */
export async function getAllProducts({ fresh = false } = {}): Promise<Product[]> {
  if (!dbConfigured()) return starter;
  const { url, key } = dbSettings();
  try {
    const res = await fetch(`${url}/rest/v1/products?select=*&order=sort_order.asc,created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      ...(fresh ? { cache: "no-store" as const } : { next: { tags: [CATALOG_TAG], revalidate: 300 } }),
    });
    if (!res.ok) throw new Error(`Database error ${res.status}`);
    const rows = (await res.json()) as ProductRow[];
    // Until the starter catalogue is imported, keep showing it so the shop is never empty.
    return rows.length ? rows.map(rowToProduct) : starter;
  } catch (e) {
    console.error("Could not load products from the database:", e);
    return starter;
  }
}

/** Products shown in the shop. */
export async function getCatalog(opts?: { fresh?: boolean }): Promise<Product[]> {
  return (await getAllProducts(opts)).filter((p) => p.active !== false);
}
