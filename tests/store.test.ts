import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { products, productBySlug, discountPercent, stockState, type Product } from "@/content/products";
import { branches, mainBranch, accessoryCategories } from "@/content/store";
import { priceCart, downPayment, maxQty } from "@/lib/pricing";
import { formatNaira, formatPhone, telHref } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { filterProducts } from "@/lib/shop";
import { requestSchema, needOptions, verifySchema } from "@/lib/schemas";
import { verifyFlutterwave, verifyPaystack } from "@/lib/payments.server";

describe("catalogue", () => {
  it("has 30 products with unique slugs and positive prices", () => {
    expect(products).toHaveLength(30);
    expect(new Set(products.map((p) => p.slug)).size).toBe(30);
    for (const p of products) expect(p.price).toBeGreaterThan(0);
  });
  it("only shows a discount when the old price is higher", () => {
    expect(discountPercent(productBySlug("iphone-16-plus-128gb")!)).toBe(4);
    expect(discountPercent(productBySlug("redmi-note-15-256gb-8gb-ram")!)).toBe(0);
  });
  it("maps every accessory category to a request-form option", () => {
    for (const c of accessoryCategories) expect(needOptions as readonly string[]).toContain(c.need);
  });
});

describe("branches", () => {
  it("has Owo as the main store and valid WhatsApp numbers", () => {
    expect(mainBranch.id).toBe("owo");
    for (const b of branches) expect(b.whatsapp).toMatch(/^234\d{10}$/);
  });
});

describe("pricing", () => {
  it("prices from the catalogue and ignores unknown items or bad quantities", () => {
    const r = priceCart([
      { slug: "iphone-14-pro-256gb", qty: 2 },
      { slug: "made-up", qty: 1 },
      { slug: "itel-5363", qty: 0 },
      { slug: "itel-5605", qty: 99 },
    ], products);
    expect(r.lines).toHaveLength(2);
    expect(r.subtotal).toBe(700000 * 2 + 15000 * 20);
    expect(r.count).toBe(22);
  });
  it("works out a 30% down payment rounded up to ₦100", () => {
    expect(downPayment(950000)).toBe(285000);
    expect(downPayment(25050)).toBe(7600);
  });
});

describe("stock", () => {
  const withStock = (slug: string, stock: number | undefined, extra: Partial<Product> = {}) => products.map((p) => (p.slug === slug ? { ...p, stock, ...extra } : p));

  it("labels stock as sold out, low (5 or fewer) or in stock", () => {
    expect(stockState({ stock: 0 })).toBe("out");
    expect(stockState({ stock: 5 })).toBe("low");
    expect(stockState({ stock: 1 })).toBe("low");
    expect(stockState({ stock: 6 })).toBe("in");
    expect(stockState({ stock: undefined })).toBe("untracked");
  });
  it("never sells more than is in stock", () => {
    const r = priceCart([{ slug: "tecno-camon-50", qty: 4 }], withStock("tecno-camon-50", 2));
    expect(r.lines[0].qty).toBe(2);
    expect(r.subtotal).toBe(1040000);
    expect(r.issues).toEqual([{ slug: "tecno-camon-50", name: "Tecno Camon 50", kind: "reduced", available: 2 }]);
  });
  it("drops sold-out and hidden products from the total", () => {
    const sold = priceCart([{ slug: "tecno-camon-50", qty: 1 }], withStock("tecno-camon-50", 0));
    expect(sold.subtotal).toBe(0);
    expect(sold.issues[0].kind).toBe("soldout");
    const hidden = priceCart([{ slug: "tecno-camon-50", qty: 1 }], withStock("tecno-camon-50", 3, { active: false }));
    expect(hidden.lines).toHaveLength(0);
    expect(hidden.issues[0].kind).toBe("gone");
  });
  it("caps the quantity picker at stock", () => {
    expect(maxQty({ stock: 3 })).toBe(3);
    expect(maxQty({ stock: 0 })).toBe(0);
    expect(maxQty({ stock: undefined })).toBe(20);
  });
  it("puts sold-out products at the end of the shop", () => {
    const list = filterProducts(withStock("iphone-16-plus-128gb", 0), { category: "all", brand: "all", condition: "all", sort: "price-desc", query: "" });
    expect(list.at(-1)?.slug).toBe("iphone-16-plus-128gb");
    expect(filterProducts(withStock("iphone-16-plus-128gb", 0), { category: "all", brand: "all", condition: "all", sort: "featured", query: "", inStock: true }).some((p) => p.slug === "iphone-16-plus-128gb")).toBe(false);
  });
  it("gives every starter product its own real photos", () => {
    for (const p of products) {
      expect(p.images?.length).toBeGreaterThanOrEqual(2);
      expect(p.images?.[0]).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\//);
    }
    expect(new Set(products.map((p) => p.images?.[0])).size).toBe(products.length);
  });
});

describe("formatting", () => {
  it("formats naira and phone numbers", () => {
    expect(formatNaira(950000)).toBe("₦950,000");
    expect(formatPhone("07036391276")).toBe("0703 639 1276");
    expect(telHref("07036391276")).toBe("tel:+2347036391276");
  });
});

describe("WhatsApp ordering", () => {
  it("writes the order to the chosen branch", () => {
    const priced = priceCart([{ slug: "tecno-camon-50", qty: 1 }], products);
    const akure = branches.find((b) => b.id === "akure")!;
    const msg = orderMessage(akure, priced.lines, priced.subtotal, { name: "Ada", phone: "08030000000", fulfilment: "pickup" });
    expect(msg).toContain("LuckyTech Akure");
    expect(msg).toContain("Tecno Camon 50");
    expect(msg).toContain("₦520,000");
    expect(msg).toContain("Pickup at: Akure Branch");
    expect(whatsappLink(akure, msg)).toMatch(/^https:\/\/wa\.me\/2347088565957\?text=/);
  });
});

describe("shop filters", () => {
  const base = { category: "all" as const, brand: "all", condition: "all" as const, sort: "featured" as const, query: "" };
  it("searches across name and specs", () => {
    expect(filterProducts(products, { ...base, query: "iphone 256" }).map((p) => p.slug)).toEqual(["iphone-14-pro-256gb"]);
  });
  it("filters by condition and sorts by price", () => {
    const used = filterProducts(products, { ...base, condition: "UK-Used", sort: "price-asc" });
    expect(used.every((p) => p.condition === "UK-Used")).toBe(true);
    expect(used.map((p) => p.price)).toEqual([...used.map((p) => p.price)].sort((a, b) => a - b));
  });
});

describe("forms", () => {
  const good = {
    name: "Ada Obi", phone: "0803 000 0000", branch: "owo", needs: ["Power bank"], budget: "",
    payLater: false, details: "20 units of 20,000mAh power banks, wholesale", website: "",
  };
  it("accepts a valid request and rejects spam or missing details", () => {
    expect(requestSchema.safeParse(good).success).toBe(true);
    expect(requestSchema.safeParse({ ...good, website: "spam.com" }).success).toBe(false);
    expect(requestSchema.safeParse({ ...good, needs: [] }).success).toBe(false);
    expect(requestSchema.safeParse({ ...good, details: "hi" }).success).toBe(false);
  });
  it("rejects payment checks with absurd quantities", () => {
    const r = verifySchema.safeParse({ provider: "paystack", reference: "LKT-123456", branch: "owo", lines: [{ slug: "itel-5363", qty: 500 }], contact: { name: "Ada", phone: "08030000000", fulfilment: "pickup" } });
    expect(r.success).toBe(false);
  });
});

describe("payment verification", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  const mockFetch = (body: unknown, ok = true) => vi.stubGlobal("fetch", vi.fn(async () => ({ ok, json: async () => body })));

  it("accepts a Paystack payment only when the amount matches", async () => {
    vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_x");
    mockFetch({ status: true, data: { status: "success", amount: 52000000, currency: "NGN", reference: "LKT-1" } });
    expect((await verifyPaystack("LKT-1", 520000)).ok).toBe(true);
    expect((await verifyPaystack("LKT-1", 950000)).ok).toBe(false);
  });
  it("rejects failed Paystack payments and missing keys", async () => {
    expect((await verifyPaystack("LKT-1", 1)).ok).toBe(false);
    vi.stubEnv("PAYSTACK_SECRET_KEY", "sk_test_x");
    mockFetch({ status: true, data: { status: "abandoned", amount: 100, currency: "NGN" } });
    expect((await verifyPaystack("LKT-1", 1)).ok).toBe(false);
  });
  it("checks the Flutterwave reference, currency and amount", async () => {
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-x");
    mockFetch({ status: "success", data: { status: "successful", amount: 520000, currency: "NGN", tx_ref: "LKT-2" } });
    expect((await verifyFlutterwave("12345", "LKT-2", 520000)).ok).toBe(true);
    expect((await verifyFlutterwave("12345", "LKT-OTHER", 520000)).ok).toBe(false);
    expect((await verifyFlutterwave("abc", "LKT-2", 520000)).ok).toBe(false);
  });
});

import { makeSessionToken, sessionTokenValid, passwordMatches } from "@/lib/auth.server";
import { slugify, adminProductSchema } from "@/lib/admin";

describe("admin sign-in", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("only accepts the right password, and only when one is set", () => {
    expect(passwordMatches("anything")).toBe(false);
    vi.stubEnv("ADMIN_PASSWORD", "lucky-owo-2026");
    expect(passwordMatches("lucky-owo-2026")).toBe(true);
    expect(passwordMatches("lucky-owo-2025")).toBe(false);
  });
  it("accepts its own session token, rejects tampered or expired ones", () => {
    vi.stubEnv("ADMIN_PASSWORD", "lucky-owo-2026");
    const t = makeSessionToken();
    expect(sessionTokenValid(t)).toBe(true);
    expect(sessionTokenValid(t.replace(/.$/, (c) => (c === "A" ? "B" : "A")))).toBe(false);
    expect(sessionTokenValid(`${Date.now() + 1e9}.forged`)).toBe(false);
    expect(sessionTokenValid(makeSessionToken(Date.now() - 13 * 3600_000))).toBe(false);
    vi.stubEnv("ADMIN_PASSWORD", "a-new-password");
    expect(sessionTokenValid(t)).toBe(false);
  });
});

describe("admin product form", () => {
  const base = { name: "Oraimo 20000mAh Power Bank", brand: "Oraimo", category: "accessories", condition: "New", price: "18500", compareAt: "", storage: "", ram: "", network: "", trackStock: true, stock: "12", images: [], description: "", featured: false, active: true };
  it("makes clean product addresses", () => {
    expect(slugify("iPhone 15 Pro Max", "256GB")).toBe("iphone-15-pro-max-256gb");
    expect(slugify("Itel A200+ S", "64GB", "8GB")).toBe("itel-a200-plus-s-64gb-8gb");
  });
  it("accepts a new accessory and turns text numbers into numbers", () => {
    const r = adminProductSchema.parse(base);
    expect(r.price).toBe(18500);
    expect(r.stock).toBe(12);
    expect(r.compareAt).toBeUndefined();
    expect(r.storage).toBeUndefined();
  });
  it("rejects missing names, negative stock and non-photo links", () => {
    expect(adminProductSchema.safeParse({ ...base, name: "" }).success).toBe(false);
    expect(adminProductSchema.safeParse({ ...base, price: "" }).success).toBe(false);
    expect(adminProductSchema.safeParse({ ...base, stock: "-1" }).success).toBe(false);
    expect(adminProductSchema.safeParse({ ...base, images: ["not a url"] }).success).toBe(false);
  });
});
