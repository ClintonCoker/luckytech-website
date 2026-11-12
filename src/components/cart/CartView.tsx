"use client";

import Link from "next/link";
import { cart, useCart } from "@/lib/cart";
import { priceCart } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";
import { productTitle } from "@/content/products";
import { ProductMedia } from "@/components/product/ProductMedia";

export function CartView() {
  const lines = useCart();
  const priced = priceCart(lines);

  if (priced.lines.length === 0) {
    return (
      <div className="card mt-10 p-10 text-center">
        <p className="font-display text-2xl font-semibold">Your cart is empty.</p>
        <p className="mt-2 text-mist">Find a phone you love, or tell us what you need.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className="btn btn-primary">Shop phones</Link>
          <Link href="/request" className="btn btn-ghost">Request a gadget</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem]">
      <ul className="space-y-3">
        {priced.lines.map(({ product: p, qty, lineTotal }) => (
          <li key={p.slug} className="card flex items-center gap-4 p-4 sm:gap-6 sm:p-5">
            <Link href={`/product/${p.slug}`} className="relative h-24 w-16 shrink-0 sm:h-28 sm:w-20">
              <ProductMedia product={p} className="h-full w-full" sizes="80px" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${p.slug}`} className="font-display font-semibold hover:text-glow">{productTitle(p)}</Link>
              <p className="text-sm text-mist">{p.condition} · {formatNaira(p.price)} each</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center rounded-full ring-1 ring-white/15">
                  <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => cart.setQty(p.slug, qty - 1)} aria-label={`One fewer ${p.name}`}>−</button>
                  <span className="w-6 text-center text-sm font-semibold tabular">{qty}</span>
                  <button type="button" className="grid h-9 w-9 place-items-center" onClick={() => cart.setQty(p.slug, qty + 1)} aria-label={`One more ${p.name}`}>+</button>
                </div>
                <button type="button" onClick={() => cart.remove(p.slug)} className="text-sm text-mist underline-offset-4 hover:text-signal-soft hover:underline">Remove</button>
              </div>
            </div>
            <p className="font-display text-lg font-semibold tabular">{formatNaira(lineTotal)}</p>
          </li>
        ))}
      </ul>
      <aside className="card h-fit p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl font-semibold">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-mist">Items</dt><dd className="tabular">{priced.count}</dd></div>
          <div className="flex justify-between"><dt className="text-mist">Delivery</dt><dd>Confirmed on WhatsApp</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd className="tabular">{formatNaira(priced.subtotal)}</dd></div>
        </dl>
        <Link href="/checkout" className="btn btn-primary mt-6 w-full">Checkout</Link>
        <Link href="/shop" className="btn btn-ghost mt-3 w-full">Keep shopping</Link>
      </aside>
    </div>
  );
}
