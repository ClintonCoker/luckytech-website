import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const pages = ["", "/shop", "/accessories", "/repairs", "/branches", "/request", "/about"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  return [...pages, ...products.map((p) => ({ url: `${base}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 }))];
}
