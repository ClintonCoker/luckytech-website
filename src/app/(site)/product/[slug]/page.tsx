import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { discountPercent, productBySlug, productTitle, stockState } from "@/content/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StockBadge } from "@/components/product/StockBadge";
import { getCatalog } from "@/lib/catalog.server";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductActions } from "@/components/product/ProductActions";
import { formatNaira } from "@/lib/format";
import { downPayment } from "@/lib/pricing";
import { getSiteUrl } from "@/lib/env";
import { IconBolt, IconShield, IconWrench } from "@/components/shared/Icons";

export async function generateStaticParams() {
  return (await getCatalog()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = productBySlug((await params).slug, await getCatalog());
  if (!p) return {};
  return {
    title: `${productTitle(p)} (${p.condition})`,
    description: `${productTitle(p)}, ${p.condition}, ${formatNaira(p.price)} at LuckyTech Owo and Akure. Pay online, pay later with 30% down, or order on WhatsApp.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: p.images?.[0] ? { images: [{ url: p.images[0] }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const catalog = await getCatalog();
  const p = productBySlug((await params).slug, catalog);
  if (!p) notFound();
  const off = discountPercent(p);
  const state = stockState(p);
  const related = catalog.filter((x) => x.slug !== p.slug && (x.brand === p.brand || x.category === p.category)).slice(0, 4);
  const specs = [
    ["Brand", p.brand],
    ["Condition", p.condition],
    ["Storage", p.storage],
    ["RAM", p.ram],
    ["Network", p.network],
  ].filter(([, v]) => v) as [string, string][];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productTitle(p),
    brand: { "@type": "Brand", name: p.brand },
    itemCondition: p.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    image: p.images,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "NGN", availability: state === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: `${getSiteUrl()}/product/${p.slug}` },
  };

  return (
    <div className="relative overflow-hidden pt-28">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="wrap relative">
        <nav aria-label="Breadcrumb" className="text-sm text-mist">
          <Link href="/shop" className="hover:text-white">Shop</Link> <span aria-hidden="true">/</span> <span className="text-white">{p.name}</span>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={p}>
            <div className="absolute left-5 top-5 z-10 flex gap-2">
              <span className="tag-cond !bg-night/70 backdrop-blur" data-used={p.condition === "UK-Used"}>{p.condition}</span>
              {off > 0 && state !== "out" && <span className="tag-sale">Save {off}%</span>}
            </div>
            <StockBadge product={p} className="absolute bottom-5 left-5 z-10" />
          </ProductGallery>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-glow">{p.brand}</p>
            <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.75rem)]">{p.name}</h1>
            {(p.storage || p.ram) && <p className="mt-2 text-lg text-mist">{[p.storage, p.ram && `${p.ram} RAM`, p.network].filter(Boolean).join(" · ")}</p>}
            <div className="mt-6 flex items-end gap-4">
              <p className="font-display text-4xl font-bold tabular sm:text-5xl">{formatNaira(p.price)}</p>
              {p.compareAt && p.compareAt > p.price && <p className="pb-1 text-lg text-mist line-through tabular">{formatNaira(p.compareAt)}</p>}
            </div>
            <p className="mt-2 text-sm text-mist">
              Or take it home with <span className="font-semibold text-white">{formatNaira(downPayment(p.price))}</span> down (30%).
            </p>

            {state === "out" ? (
              <p className="mt-6 rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10"><span className="font-semibold">Sold out for now.</span> Message us on WhatsApp and we&rsquo;ll tell you when it&rsquo;s back, or ask about something similar.</p>
            ) : state === "low" ? (
              <p className="mt-6 text-sm font-semibold text-[#ffb020]">Hurry, only {p.stock} left in stock.</p>
            ) : p.stock != null ? (
              <p className="mt-6 text-sm text-glow">In stock</p>
            ) : null}

            <ProductActions slug={p.slug} title={productTitle(p)} price={formatNaira(p.price)} maxQty={state === "out" ? 0 : p.stock == null ? 20 : Math.min(20, p.stock)} />

            {p.description && <p className="mt-8 leading-relaxed text-mist">{p.description}</p>}

            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                [<IconShield key="s" />, p.condition === "UK-Used" ? "Tested before sale" : "Brand new in box"],
                [<IconWrench key="w" />, "Repairs in under 45 min"],
                [<IconBolt key="b" />, "Pickup in Owo or Akure"],
              ].map(([icon, text], i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-line p-4 text-sm">
                  <span className="text-glow">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-xl font-semibold">Specs</h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                  <dt className="text-mist">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-28" aria-labelledby="related-title">
            <h2 id="related-title" className="display text-[clamp(1.8rem,4vw,2.75rem)]">You might also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((r) => <ProductCard key={r.slug} product={r} />)}
            </div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
