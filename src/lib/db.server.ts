import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/content/products";

/** Database connection settings (Supabase → Project Settings → API). */
export function dbSettings() {
  return {
    url: (process.env.SUPABASE_URL || "").replace(/\/$/, ""),
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}
export const dbConfigured = () => Boolean(dbSettings().url && dbSettings().key);

let client: SupabaseClient | null = null;
/** Server-only client with full access. Never send the key to the browser. */
export function db(): SupabaseClient {
  const { url, key } = dbSettings();
  if (!url || !key) throw new Error("Database is not set up (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export const PHOTO_BUCKET = "product-photos";

export interface ProductRow {
  slug: string;
  name: string;
  brand: string;
  category: Product["category"];
  condition: Product["condition"];
  price: number;
  compare_at: number | null;
  storage: string | null;
  ram: string | null;
  network: "4G" | "5G" | null;
  stock: number | null;
  images: string[];
  description: string | null;
  featured: boolean;
  active: boolean;
  style: Product["style"];
  tint: string[];
  sort_order: number;
  updated_at?: string;
}

export function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    condition: r.condition,
    price: r.price,
    compareAt: r.compare_at ?? undefined,
    storage: r.storage ?? undefined,
    ram: r.ram ?? undefined,
    network: r.network ?? undefined,
    stock: r.stock ?? undefined,
    images: r.images ?? [],
    description: r.description ?? undefined,
    featured: r.featured,
    active: r.active,
    style: r.style,
    tint: [r.tint?.[0] ?? "#1f2330", r.tint?.[1] ?? "#3a4157"],
  };
}

export function productToRow(p: Product, sortOrder = 1000): ProductRow {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    condition: p.condition,
    price: Math.round(p.price),
    compare_at: p.compareAt ?? null,
    storage: p.storage ?? null,
    ram: p.ram ?? null,
    network: p.network ?? null,
    stock: p.stock ?? null,
    images: p.images ?? [],
    description: p.description ?? null,
    featured: Boolean(p.featured),
    active: p.active !== false,
    style: p.style,
    tint: p.tint,
    sort_order: sortOrder,
  };
}
