/**
 * Product catalogue, copied from luckytechstore.com/shop (November 2026).
 * Prices are in naira. `compareAt` is the old price shown crossed out.
 *
 * To add a real photo, put it in public/products/<slug>.jpg (or .png/.webp)
 * and set `image: "/products/<slug>.jpg"`. Without a photo the site draws
 * a clean device illustration in the product's colours.
 *
 * Slugs are kept the same as the old site so old links keep working.
 */

export type Category = "smartphones" | "tablets" | "budget";
export type Condition = "New" | "UK-Used";
export type DeviceStyle = "iphone" | "galaxy-s" | "galaxy-a" | "redmi" | "infinix" | "tecno" | "itel" | "keypad" | "tablet";

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  condition: Condition;
  price: number;
  compareAt?: number;
  storage?: string;
  ram?: string;
  network?: "5G" | "4G";
  style: DeviceStyle;
  /** Two colours for the device illustration: body and accent. */
  tint: [string, string];
  image?: string;
  featured?: boolean;
  /** Something to double-check with the store before launch. */
  verify?: string;
}

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "smartphones", label: "Smartphones", blurb: "iPhone, Samsung, Redmi, Infinix, Tecno and Itel" },
  { id: "tablets", label: "Tablets", blurb: "Tablets for work, school and kids" },
  { id: "budget", label: "Budget & keypad phones", blurb: "Long battery, low price, built to last" },
];

export const products: Product[] = [
  { slug: "iphone-16-plus-128gb", name: "iPhone 16 Plus", brand: "Apple", category: "smartphones", condition: "UK-Used", price: 950000, compareAt: 990000, storage: "128GB", network: "5G", style: "iphone", tint: ["#c9d6e8", "#7d93b5"], featured: true },
  { slug: "iphone-14-pro-256gb", name: "iPhone 14 Pro", brand: "Apple", category: "smartphones", condition: "UK-Used", price: 700000, compareAt: 720000, storage: "256GB", network: "5G", style: "iphone", tint: ["#4b4560", "#2a2635"], featured: true },
  { slug: "samsung-s22-ultra-5g-128gb-8gb-ram", name: "Samsung Galaxy S22 Ultra 5G", brand: "Samsung", category: "smartphones", condition: "UK-Used", price: 400000, compareAt: 450000, storage: "128GB", ram: "8GB", network: "5G", style: "galaxy-s", tint: ["#2d4a3e", "#1a2c25"], featured: true },
  { slug: "samsung-s20-5g-128gb-12gb-ram", name: "Samsung Galaxy S20 5G", brand: "Samsung", category: "smartphones", condition: "UK-Used", price: 250000, compareAt: 280000, storage: "128GB", ram: "12GB", network: "5G", style: "galaxy-s", tint: ["#9fb4c9", "#5d7590"] },
  { slug: "samsung-a17-128gb-4gb", name: "Samsung Galaxy A17", brand: "Samsung", category: "smartphones", condition: "New", price: 260000, compareAt: 280000, storage: "128GB", ram: "4GB", style: "galaxy-a", tint: ["#1f2330", "#3a4157"] },
  { slug: "samsung-a07-128gb-8gb", name: "Samsung Galaxy A07", brand: "Samsung", category: "smartphones", condition: "New", price: 190000, compareAt: 195000, storage: "128GB", ram: "8GB", style: "galaxy-a", tint: ["#b8c7b0", "#6f8566"] },
  { slug: "redmi-note-17-256gb-16gb", name: "Redmi Note 17", brand: "Redmi", category: "smartphones", condition: "New", price: 420000, compareAt: 450000, storage: "256GB", ram: "16GB", style: "redmi", tint: ["#1d2a44", "#4f6fae"], featured: true },
  { slug: "redmi-note-15-256gb-8gb-ram", name: "Redmi Note 15", brand: "Redmi", category: "smartphones", condition: "New", price: 350000, storage: "256GB", ram: "8GB", style: "redmi", tint: ["#e8e3d8", "#a99e86"], verify: "Old site listed 350,000 then 340,000 (old price lower than new). Confirm the price." },
  { slug: "redmi-15c-256gb-16gb", name: "Redmi 15C", brand: "Redmi", category: "smartphones", condition: "New", price: 230000, compareAt: 240000, storage: "256GB", ram: "16GB", style: "redmi", tint: ["#2c6b5a", "#173d33"] },
  { slug: "redmi-15c-128gb-8gb", name: "Redmi 15C", brand: "Redmi", category: "smartphones", condition: "New", price: 190000, compareAt: 195000, storage: "128GB", ram: "8GB", style: "redmi", tint: ["#121417", "#33373d"] },
  { slug: "redmi-a7-pro-128gb-8gb", name: "Redmi A7 Pro", brand: "Redmi", category: "smartphones", condition: "New", price: 170000, compareAt: 180000, storage: "128GB", ram: "8GB", style: "redmi", tint: ["#3c4f78", "#1e2a44"] },
  { slug: "infinix-note-edge-5g-256gb-16gb", name: "Infinix Note Edge 5G", brand: "Infinix", category: "smartphones", condition: "New", price: 520000, compareAt: 550000, storage: "256GB", ram: "16GB", network: "5G", style: "infinix", tint: ["#d9d2f0", "#8a7fc0"], featured: true },
  { slug: "infinix-note-edge-255gb-8gb-ram", name: "Infinix Note Edge", brand: "Infinix", category: "smartphones", condition: "New", price: 500000, compareAt: 520000, storage: "256GB", ram: "16GB", style: "infinix", tint: ["#1b1d22", "#4b5160"], verify: "Old link says 255GB/8GB RAM but the name says 256GB/16GB RAM. Confirm the specs." },
  { slug: "infinix-hot-70-128gb-8gb", name: "Infinix Hot 70", brand: "Infinix", category: "smartphones", condition: "New", price: 225000, compareAt: 230000, storage: "128GB", ram: "8GB", style: "infinix", tint: ["#7fc8c2", "#2f8a83"] },
  { slug: "infinix-smart-20-64gb-8gb", name: "Infinix Smart 20", brand: "Infinix", category: "smartphones", condition: "New", price: 160000, compareAt: 165000, storage: "64GB", ram: "8GB", style: "infinix", tint: ["#f0d9b8", "#c79a5c"] },
  { slug: "infinix-smart-20-hd-64gb-6gb-ram", name: "Infinix Smart 20 HD", brand: "Infinix", category: "smartphones", condition: "New", price: 150000, compareAt: 155000, storage: "64GB", ram: "6GB", style: "infinix", tint: ["#20242c", "#454d5c"] },
  { slug: "tecno-camon-50", name: "Tecno Camon 50", brand: "Tecno", category: "smartphones", condition: "New", price: 520000, compareAt: 550000, style: "tecno", tint: ["#e6eef2", "#94aab6"], featured: true },
  { slug: "tecno-spark-50-128gb-12gb", name: "Tecno Spark 50", brand: "Tecno", category: "smartphones", condition: "New", price: 215000, compareAt: 225000, storage: "128GB", ram: "12GB", style: "tecno", tint: ["#2b3a63", "#5f79c2"] },
  { slug: "tecno-pop-20-128gb-8gb-ram", name: "Tecno POP 20", brand: "Tecno", category: "smartphones", condition: "New", price: 180000, compareAt: 190000, storage: "128GB", ram: "8GB", style: "tecno", tint: ["#1d1f24", "#40454f"] },
  { slug: "tecno-pop-20-64gb", name: "Tecno POP 20", brand: "Tecno", category: "smartphones", condition: "New", price: 160000, compareAt: 165000, storage: "64GB", ram: "8GB", style: "tecno", tint: ["#4a7bd0", "#24447f"] },
  { slug: "itel-a200-s-64gb-8gb-ram", name: "Itel A200+ S", brand: "Itel", category: "smartphones", condition: "New", price: 130000, storage: "64GB", ram: "8GB", style: "itel", tint: ["#9bc7e8", "#4d86b3"] },
  { slug: "itel-a200-64gb-8gb-ram", name: "Itel A200+", brand: "Itel", category: "smartphones", condition: "New", price: 130000, compareAt: 135000, storage: "64GB", ram: "8GB", style: "itel", tint: ["#1e2126", "#454b55"] },
  { slug: "itel-a50cs-64gb-6gb-ram", name: "Itel A50CS", brand: "Itel", category: "smartphones", condition: "New", price: 115000, compareAt: 120000, storage: "64GB", ram: "6GB", style: "itel", tint: ["#c7d9c2", "#7c9a73"] },
  { slug: "airtab-pg02", name: "AirTab PG02 (Children & Adult)", brand: "AirTab", category: "tablets", condition: "New", price: 160000, compareAt: 195000, style: "tablet", tint: ["#2a3346", "#56688f"] },
  { slug: "origimo-opad-mini-12-512gb-8gb-ram", name: "Origimo Opad Mini 12 (for Children)", brand: "Origimo", category: "tablets", condition: "New", price: 80000, compareAt: 95000, storage: "512GB", ram: "8GB", style: "tablet", tint: ["#f2b8c6", "#c46a85"], verify: "512GB storage at ₦80,000 is unusual. Confirm the specs." },
  { slug: "itel-music-450", name: "Itel Music 450", brand: "Itel", category: "budget", condition: "New", price: 25000, compareAt: 28000, style: "keypad", tint: ["#1d2026", "#3f4652"] },
  { slug: "itel-5363", name: "Itel 5363", brand: "Itel", category: "budget", condition: "New", price: 25000, compareAt: 28000, style: "keypad", tint: ["#2d3c5c", "#5b77b0"] },
  { slug: "itel-5605", name: "Itel 5606", brand: "Itel", category: "budget", condition: "New", price: 15000, compareAt: 18000, style: "keypad", tint: ["#6b1d24", "#b23a44"], verify: "Old link says Itel 5605, name says Itel 5606. Confirm the model." },
  { slug: "mtk-i17-pro", name: "MTK i17 Pro", brand: "MTK", category: "budget", condition: "New", price: 25000, compareAt: 30000, style: "iphone", tint: ["#e9d3b9", "#b48b5e"] },
  { slug: "mtk-i17-air", name: "MTK i17 Air", brand: "MTK", category: "budget", condition: "New", price: 25000, compareAt: 30000, style: "iphone", tint: ["#cfe0ec", "#7f9fb8"] },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export function productTitle(p: Product): string {
  const spec = [p.storage, p.ram && `${p.ram} RAM`].filter(Boolean).join(" · ");
  return spec ? `${p.name} ${spec}` : p.name;
}

export function discountPercent(p: Product): number {
  if (!p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round(((p.compareAt - p.price) / p.compareAt) * 100);
}

export const productBrands = Array.from(new Set(products.map((p) => p.brand)));
