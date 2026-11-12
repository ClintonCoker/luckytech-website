/**
 * Product catalogue, copied from luckytechstore.com/shop (November 2026).
 * Prices are in naira. `compareAt` is the old price shown crossed out.
 *
 * This is the starter list. Once the database is connected (see README),
 * products, stock and photos are managed from /admin instead, and this
 * list is only used to fill the database the first time.
 *
 * Photos are LuckyTech's own product photos from the old site. Use
 * "Copy photos to our storage" in /admin to keep permanent copies.
 *
 * Slugs are kept the same as the old site so old links keep working.
 */

export type Category = "smartphones" | "tablets" | "budget" | "accessories" | "gadgets";
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
  /** Two colours for the fallback illustration (used only when there's no photo). */
  tint: [string, string];
  /** Photo URLs, main photo first. */
  images?: string[];
  /** Units in stock. Leave out for "in stock, count not tracked". */
  stock?: number;
  /** Hidden from the shop when false. */
  active?: boolean;
  description?: string;
  featured?: boolean;
  /** Something to double-check with the store before launch. */
  verify?: string;
}

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: "smartphones", label: "Smartphones", blurb: "iPhone, Samsung, Redmi, Infinix, Tecno and Itel" },
  { id: "tablets", label: "Tablets", blurb: "Tablets for work, school and kids" },
  { id: "budget", label: "Budget & keypad phones", blurb: "Long battery, low price, built to last" },
  { id: "accessories", label: "Accessories", blurb: "Chargers, cables, cases, screen guards and power banks" },
  { id: "gadgets", label: "Gadgets", blurb: "Speakers, earbuds, smartwatches and more" },
];

const OLD = "https://nwyyccpjmoqrkiilcrjp.supabase.co/storage/v1/object/public/product-images";
const PHOTOS: Record<string, string[]> = {
  "infinix-note-edge-255gb-8gb-ram": [
    "3385a23c-71ac-4919-a8b8-5f0f5d7d4e85/1793283868019-gwrdlb.jpeg",
    "3385a23c-71ac-4919-a8b8-5f0f5d7d4e85/1793283873556-ppiywx.webp"
  ],
  "itel-a50cs-64gb-6gb-ram": [
    "32a559b3-4d59-46a2-ae8a-25b1352d1c4f/1793282131412-rooe71.jpeg",
    "32a559b3-4d59-46a2-ae8a-25b1352d1c4f/1793282134176-0vyxms.png"
  ],
  "itel-a200-s-64gb-8gb-ram": [
    "d3f1178b-372e-43c9-b9d4-841e59282aed/1793280914776-42wlqm.jpeg",
    "d3f1178b-372e-43c9-b9d4-841e59282aed/1793281051221-yocghg.png"
  ],
  "airtab-pg02": [
    "366cffc8-0435-43e7-bb1e-80018a0900b3/1793270346052-5ycp38.jpeg",
    "366cffc8-0435-43e7-bb1e-80018a0900b3/1793270349487-zow3jr.jpeg"
  ],
  "origimo-opad-mini-12-512gb-8gb-ram": [
    "28ac7118-4e4e-47df-992c-f9a181cfe53e/1793269201281-6d6zu4.jpeg",
    "28ac7118-4e4e-47df-992c-f9a181cfe53e/1793269204251-h7kaot.jpeg"
  ],
  "iphone-16-plus-128gb": [
    "c6e858b1-17ef-4272-bfd5-56ea15ccb3ad/1793205327243-da6glu.jpeg",
    "c6e858b1-17ef-4272-bfd5-56ea15ccb3ad/1793205332701-3u97qt.jpeg"
  ],
  "samsung-s20-5g-128gb-12gb-ram": [
    "d38ae707-e529-41b2-a2c2-15c82f136ea0/1793200891995-enmqfv.jpeg",
    "d38ae707-e529-41b2-a2c2-15c82f136ea0/1793200895104-bj99sh.jpeg"
  ],
  "samsung-s22-ultra-5g-128gb-8gb-ram": [
    "b8bb4948-9538-4907-8cda-21cfc71cddd2/1793198345051-55arth.jpeg",
    "b8bb4948-9538-4907-8cda-21cfc71cddd2/1793198403695-ph1zkl.webp"
  ],
  "iphone-14-pro-256gb": [
    "9a708aed-d889-4f4e-89b9-59cefeccd4de/1793194719270-ao50tr.jpeg",
    "9a708aed-d889-4f4e-89b9-59cefeccd4de/1793194721079-ru3p8f.jpeg",
    "9a708aed-d889-4f4e-89b9-59cefeccd4de/1793194722861-2q1ly0.jpeg"
  ],
  "itel-music-450": [
    "6191a591-ae82-4d1f-8696-7988604d344f/1792593915056-jo9f2q.jpeg",
    "6191a591-ae82-4d1f-8696-7988604d344f/1792593917762-alv5k7.jpeg"
  ],
  "itel-5363": [
    "5be8053a-631e-48c2-a0cc-5689f1907a8c/1793199005087-dium04.jpeg",
    "5be8053a-631e-48c2-a0cc-5689f1907a8c/1793199008288-hh1671.jpeg"
  ],
  "itel-5605": [
    "faf18401-6b07-43d0-922f-8077c6746bb0/1792592530842-v4p8wj.jpeg",
    "faf18401-6b07-43d0-922f-8077c6746bb0/1792592532746-7so37u.png",
    "faf18401-6b07-43d0-922f-8077c6746bb0/1792592533880-p1xkrl.png"
  ],
  "mtk-i17-pro": [
    "26c419cc-c37e-4fc5-b3d9-d923c63ee859/1792591854391-7m3nj8.jpeg",
    "26c419cc-c37e-4fc5-b3d9-d923c63ee859/1792591856567-h3ns7o.jpeg"
  ],
  "mtk-i17-air": [
    "c78154de-921a-4adc-93a7-c24333709bba/1792589565854-qggl1i.jpeg",
    "c78154de-921a-4adc-93a7-c24333709bba/1792590616913-mid1f0.jpeg",
    "c78154de-921a-4adc-93a7-c24333709bba/1792590618553-9uj7qe.webp"
  ],
  "redmi-note-17-256gb-16gb": [
    "6784e14b-aaf5-4d0d-a2bc-639b0c9e1602/1792583921756-cyu5qm.jpeg",
    "6784e14b-aaf5-4d0d-a2bc-639b0c9e1602/1792583924769-o1woy8.png",
    "6784e14b-aaf5-4d0d-a2bc-639b0c9e1602/1792583925954-jtevmy.jpeg"
  ],
  "samsung-a07-128gb-8gb": [
    "121576d5-6308-49e5-b925-6c1577debcce/1792583154199-77yg8k.jpeg",
    "121576d5-6308-49e5-b925-6c1577debcce/1792583156882-b883zl.webp"
  ],
  "samsung-a17-128gb-4gb": [
    "7439999b-57c4-407b-8e7c-b195ce7d36f4/1792577959170-2k1637.jpeg",
    "7439999b-57c4-407b-8e7c-b195ce7d36f4/1792577961564-0eqh6c.jpeg"
  ],
  "itel-a200-64gb-8gb-ram": [
    "c9633af8-15cb-403e-b511-d87ac657c730/1792419802755-vydax2.jpeg",
    "c9633af8-15cb-403e-b511-d87ac657c730/1792419804138-psbfwm.jpeg"
  ],
  "redmi-note-15-256gb-8gb-ram": [
    "c59bb28e-50a9-4a9e-a1af-ecd45d38784e/1792254963351-zskt0n.webp",
    "c59bb28e-50a9-4a9e-a1af-ecd45d38784e/1792254964417-cejqek.jpeg",
    "c59bb28e-50a9-4a9e-a1af-ecd45d38784e/1792254964927-trwz7g.jpeg"
  ],
  "redmi-15c-256gb-16gb": [
    "26cd9522-f232-465b-bebf-86fd1e4a5db2/1792171750784-thxzzl.jpeg",
    "26cd9522-f232-465b-bebf-86fd1e4a5db2/1792171842156-4fhwbq.jpeg"
  ],
  "redmi-15c-128gb-8gb": [
    "60711ba4-62fd-4646-bc43-c63be1153844/1792171111352-54f6dt.jpeg",
    "60711ba4-62fd-4646-bc43-c63be1153844/1792171373300-5afq2h.jpeg"
  ],
  "redmi-a7-pro-128gb-8gb": [
    "e9fc6c22-91a6-44eb-9e59-5a325e624ca6/1792169480440-lx8vxp.jpeg",
    "e9fc6c22-91a6-44eb-9e59-5a325e624ca6/1792169482382-m52q2z.jpeg"
  ],
  "infinix-hot-70-128gb-8gb": [
    "3afc1871-96fb-4929-b959-f08de65bfcaa/1792166181991-xmj94n.png",
    "3afc1871-96fb-4929-b959-f08de65bfcaa/1792166183506-q3fn1g.jpeg",
    "3afc1871-96fb-4929-b959-f08de65bfcaa/1792166187919-31e71u.jpeg"
  ],
  "infinix-note-edge-5g-256gb-16gb": [
    "5f7113c3-df50-437a-84a1-628145036134/1792162642389-ky4osb.jpeg",
    "5f7113c3-df50-437a-84a1-628145036134/1792162643748-y623st.jpeg"
  ],
  "infinix-smart-20-64gb-8gb": [
    "90619422-d499-4315-9a5d-927f591440f3/1792159189933-jl3bae.jpeg",
    "90619422-d499-4315-9a5d-927f591440f3/1792159191484-cc2fsp.jpeg"
  ],
  "infinix-smart-20-hd-64gb-6gb-ram": [
    "6c28fe42-c9b7-4c67-8f36-e7192d1ee1c0/1792155130677-ddk5i6.png",
    "6c28fe42-c9b7-4c67-8f36-e7192d1ee1c0/1792155133095-6cfsj4.jpeg"
  ],
  "tecno-camon-50": [
    "c05e2657-e50c-43c8-a16c-9058fdb5fe0c/1792079917773-yd5sqk.jpeg",
    "c05e2657-e50c-43c8-a16c-9058fdb5fe0c/1792079918940-naxve0.jpeg"
  ],
  "tecno-spark-50-128gb-12gb": [
    "01b4eee1-e5d7-47b4-afc2-c307b44925be/1792073609908-gpaijw.webp",
    "01b4eee1-e5d7-47b4-afc2-c307b44925be/1792073611035-2vej2n.jpeg"
  ],
  "tecno-pop-20-128gb-8gb-ram": [
    "4d8e8c1a-ddcb-474b-bd1a-1698dd47a95d/1792066590104-019dat.png",
    "4d8e8c1a-ddcb-474b-bd1a-1698dd47a95d/1792066591206-5zuuit.jpeg"
  ],
  "tecno-pop-20-64gb": [
    "106d71d6-067d-4039-93ed-f71df6ee68d9/1792062320988-oczrf2.png",
    "106d71d6-067d-4039-93ed-f71df6ee68d9/1792062327544-y7g9c8.jpeg"
  ]
};

const starter: Product[] = [
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

/** Starter catalogue with LuckyTech's photos attached. */
export const products: Product[] = starter.map((p) => ({ ...p, images: (PHOTOS[p.slug] ?? []).map((f) => `${OLD}/${f}`) }));

export const productBySlug = (slug: string, list: readonly Product[] = products) => list.find((p) => p.slug === slug);

/** Low-stock threshold for the "only N left" badge and admin alerts. */
export const LOW_STOCK = 5;

export type StockState = "untracked" | "in" | "low" | "out";
export function stockState(p: Pick<Product, "stock">): StockState {
  if (p.stock == null) return "untracked";
  if (p.stock <= 0) return "out";
  if (p.stock <= LOW_STOCK) return "low";
  return "in";
}

export function productTitle(p: Product): string {
  const spec = [p.storage, p.ram && `${p.ram} RAM`].filter(Boolean).join(" · ");
  return spec ? `${p.name} ${spec}` : p.name;
}

export function discountPercent(p: Product): number {
  if (!p.compareAt || p.compareAt <= p.price) return 0;
  return Math.round(((p.compareAt - p.price) / p.compareAt) * 100);
}

export const brandsOf = (list: readonly Product[]) => Array.from(new Set(list.map((p) => p.brand))).sort();
