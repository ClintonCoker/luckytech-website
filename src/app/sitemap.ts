import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog.server";
import { getSiteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  const base = getSiteUrl();
  const pages = ["", "/shop", "/accessories", "/repairs", "/branches", "/request", "/about"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  return [...pages, ...products.map((p) => ({ url: `${base}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }))];
}
