import type { Metadata } from "next";
import { categories, type Category } from "@/content/products";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { getCatalog } from "@/lib/catalog.server";

export const metadata: Metadata = {
  title: "Shop phones, tablets and more",
  description: "New and UK-used iPhone, Samsung, Redmi, Infinix, Tecno and Itel phones and tablets at LuckyTech, Owo and Akure. Pay with Paystack, Flutterwave or order on WhatsApp.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = typeof sp.category === "string" ? sp.category : "";
  const category = categories.some((c) => c.id === raw) ? (raw as Category) : "all";
  const q = typeof sp.q === "string" ? sp.q.slice(0, 60) : "";
  const catalog = await getCatalog();
  return (
    <div className="relative overflow-hidden pt-32">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="wrap relative">
        <p className="eyebrow">Shop</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,7vw,5.5rem)]">Find your next phone.</h1>
        <p className="mt-4 max-w-xl text-lg text-mist">Prices in naira. Every UK-used phone is tested before it’s sold. Pay online or order on WhatsApp.</p>
        <ShopBrowser catalog={catalog} initialCategory={category} initialQuery={q} />
      </div>
    </div>
  );
}
