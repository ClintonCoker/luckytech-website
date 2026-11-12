"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { products as starter, type Product } from "@/content/products";
import { endSession, passwordMatches, requireAdmin, startSession, adminConfigured } from "@/lib/auth.server";
import { db, dbSettings, PHOTO_BUCKET, productToRow, rowToProduct, type ProductRow } from "@/lib/db.server";
import { CATALOG_TAG } from "@/lib/catalog.server";
import { adminProductSchema, slugify, type AdminProductInput } from "@/lib/admin";

type Result = { ok: true; message?: string; slug?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const refresh = () => updateTag(CATALOG_TAG);

/* ------------------------------ sign in / out ------------------------------ */

const attempts = new Map<string, { n: number; until: number }>();

export async function loginAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  if (!adminConfigured()) return { error: "Admin password isn't set. Add ADMIN_PASSWORD (8+ characters) to the settings, then restart." };
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const a = attempts.get(ip);
  if (a && a.until > Date.now()) return { error: "Too many tries. Wait a minute and try again." };
  const ok = passwordMatches(String(form.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 700));
    const n = (a?.n ?? 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 60_000 : 0 });
    return { error: "Wrong password." };
  }
  attempts.delete(ip);
  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------ stock ------------------------------ */

export async function setStockAction(slug: string, stock: number | null): Promise<Result> {
  await requireAdmin();
  if (stock != null && (!Number.isInteger(stock) || stock < 0 || stock > 100_000)) return { ok: false, error: "Enter a whole number, 0 or more." };
  const { error } = await db().from("products").update({ stock, updated_at: new Date().toISOString() }).eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function adjustStockAction(slug: string, by: number): Promise<Result & { stock?: number }> {
  await requireAdmin();
  const { data, error } = await db().from("products").select("stock").eq("slug", slug).single();
  if (error) return { ok: false, error: error.message };
  const next = Math.max(0, (data?.stock ?? 0) + Math.trunc(by));
  const r = await setStockAction(slug, next);
  return r.ok ? { ok: true, stock: next } : r;
}

export async function setActiveAction(slug: string, active: boolean): Promise<Result> {
  await requireAdmin();
  const { error } = await db().from("products").update({ active, updated_at: new Date().toISOString() }).eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

/* ------------------------------ add / edit / delete ------------------------------ */

export async function saveProductAction(input: AdminProductInput): Promise<Result> {
  await requireAdmin();
  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const v = parsed.data;
  const client = db();
  let slug = v.slug;
  let existing: ProductRow | null = null;

  if (slug) {
    const { data } = await client.from("products").select("*").eq("slug", slug).maybeSingle();
    existing = (data as ProductRow | null) ?? null;
    if (!existing) return { ok: false, error: "That product no longer exists." };
  } else {
    const base = slugify(v.name, v.storage, v.ram) || "product";
    slug = base;
    for (let n = 2; ; n++) {
      const { data } = await client.from("products").select("slug").eq("slug", slug).maybeSingle();
      if (!data) break;
      slug = `${base}-${n}`;
    }
  }

  const before = existing ? rowToProduct(existing) : undefined;
  const product: Product = {
    slug,
    name: v.name,
    brand: v.brand,
    category: v.category,
    condition: v.condition,
    price: v.price,
    compareAt: v.compareAt,
    storage: v.storage,
    ram: v.ram,
    network: v.network,
    stock: v.trackStock ? v.stock : undefined,
    images: v.images,
    description: v.description,
    featured: v.featured,
    active: v.active,
    style: before?.style ?? (v.category === "tablets" ? "tablet" : v.category === "budget" ? "keypad" : /iphone/i.test(v.name) ? "iphone" : "galaxy-a"),
    tint: before?.tint ?? ["#1f2330", "#3a4157"],
  };
  const row = { ...productToRow(product, existing?.sort_order ?? 1000), updated_at: new Date().toISOString() };
  const { error } = await client.from("products").upsert(row);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true, slug, message: existing ? "Saved." : "Product added." };
}

export async function deleteProductAction(slug: string): Promise<Result> {
  await requireAdmin();
  const { error } = await db().from("products").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

/* ------------------------------ setup helpers ------------------------------ */

/** Copies the 30 starter products into the database (skips any that already exist). */
export async function importStarterAction(): Promise<Result> {
  await requireAdmin();
  const rows = starter.map((p, i) => productToRow(p, i * 10));
  const { error } = await db().from("products").upsert(rows, { onConflict: "slug", ignoreDuplicates: true });
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true, message: `Imported ${rows.length} products. Their stock isn't counted yet: type the real numbers in the "In stock" boxes below.` };
}

/**
 * Copies photos that live somewhere else (like the old site's storage) into
 * our own photo storage, a few products at a time. Call again until `remaining` is 0.
 */
export async function copyPhotosAction(): Promise<Result & { remaining?: number; copied?: number }> {
  await requireAdmin();
  const own = `${dbSettings().url}/storage/v1/object/public/${PHOTO_BUCKET}/`;
  const client = db();
  const { data, error } = await client.from("products").select("slug, images");
  if (error) return { ok: false, error: error.message };
  const todo = (data as Pick<ProductRow, "slug" | "images">[]).filter((r) => r.images?.some((u) => !u.startsWith(own)));
  let copied = 0;
  let firstError: string | undefined;
  for (const r of todo.slice(0, 4)) {
    const next: string[] = [];
    for (const url of r.images) {
      if (url.startsWith(own)) {
        next.push(url);
        continue;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Couldn't download a photo from the old site (error ${res.status}).`);
        const type = res.headers.get("content-type") || "image/jpeg";
        const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
        const path = `${r.slug}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const up = await client.storage.from(PHOTO_BUCKET).upload(path, await res.arrayBuffer(), { contentType: type, upsert: false });
        if (up.error) throw new Error(`Couldn't save to your photo storage: ${up.error.message}`);
        next.push(own + path);
        copied++;
      } catch (e) {
        firstError ??= e instanceof Error ? e.message : String(e);
        next.push(url); // keep the old link if a copy fails
      }
    }
    await client.from("products").update({ images: next }).eq("slug", r.slug);
  }
  refresh();
  if (copied === 0 && firstError) return { ok: false, error: firstError };
  return { ok: true, copied, remaining: Math.max(0, todo.length - 4) };
}

