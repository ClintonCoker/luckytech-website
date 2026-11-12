import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { products, productBySlug, discountPercent } from "@/content/products";
import { branches, mainBranch, accessoryCategories } from "@/content/store";
import { priceCart, downPayment } from "@/lib/pricing";
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
    ]);
    expect(r.lines).toHaveLength(2);
    expect(r.subtotal).toBe(700000 * 2 + 15000 * 20);
    expect(r.count).toBe(22);
  });
  it("works out a 30% down payment rounded up to ₦100", () => {
    expect(downPayment(950000)).toBe(285000);
    expect(downPayment(25050)).toBe(7600);
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
    const priced = priceCart([{ slug: "tecno-camon-50", qty: 1 }]);
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
    name: "Ada Obi", phone: "0803 000 0000", email: "", branch: "owo", needs: ["Power bank"], buyingFor: "wholesale",
    condition: "any", payment: "full", timeline: "this-week", details: "20 units of 20,000mAh power banks", website: "",
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
