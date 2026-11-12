import { z } from "zod";

/** Makes a web address name for a product: "iPhone 15 Pro" + "256GB" → "iphone-15-pro-256gb". */
export function slugify(...parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const money = z.coerce.number().int("Whole naira only").min(0, "Can't be negative").max(100_000_000);
const optText = z.string().trim().max(40).optional().transform((v) => v || undefined);

export const adminProductSchema = z.object({
  slug: z.string().optional(),
  name: z.string().trim().min(2, "Enter a product name").max(120),
  brand: z.string().trim().min(1, "Enter a brand").max(40),
  category: z.enum(["smartphones", "tablets", "budget", "accessories", "gadgets"]),
  condition: z.enum(["New", "UK-Used"]),
  price: z.coerce.number().int("Whole naira only").min(1, "Enter a price").max(100_000_000),
  compareAt: z.union([z.literal(""), money]).optional().transform((v) => (v === "" || v == null || v === 0 ? undefined : v)),
  storage: optText,
  ram: optText,
  network: z.enum(["", "4G", "5G"]).optional().transform((v) => (v ? v : undefined)),
  trackStock: z.boolean(),
  stock: z.coerce.number().int("Whole numbers only").min(0, "Can't be negative").max(100_000),
  images: z.array(z.string().url()).max(10, "Up to 10 photos"),
  description: z.string().trim().max(1000).optional().transform((v) => v || undefined),
  featured: z.boolean(),
  active: z.boolean(),
});

export type AdminProductInput = z.input<typeof adminProductSchema>;
