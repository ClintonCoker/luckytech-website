"use client";

import Link from "next/link";
import { useState } from "react";
import { discountPercent, type Product } from "@/content/products";
import { ProductMedia } from "@/components/product/ProductMedia";
import { formatNaira } from "@/lib/format";
import { cart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product);
  const [added, setAdded] = useState(false);
  const spec = [product.storage, product.ram && `${product.ram} RAM`, product.network].filter(Boolean).join(" · ");

  return (
    <article
      className="card card-glow group flex h-full flex-col transition-transform duration-500 hover:-translate-y-1"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden" aria-label={product.name}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgb(62_224_127/0.16),transparent_60%)]" />
        <div className="absolute left-3 top-3 z-10 flex gap-1.5">
          <span className="tag-cond" data-used={product.condition === "UK-Used"}>{product.condition}</span>
          {off > 0 && <span className="tag-sale">-{off}%</span>}
        </div>
        <div className="absolute inset-x-[18%] inset-y-[9%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-4deg] group-hover:scale-[1.04]">
          <ProductMedia product={product} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 border-t border-line p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">{product.brand}</p>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug sm:text-lg">
            <Link href={`/product/${product.slug}`} className="hover:text-glow">{product.name}</Link>
          </h3>
          {spec && <p className="mt-1 text-sm text-mist">{spec}</p>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold tabular sm:text-xl">{formatNaira(product.price)}</p>
            {product.compareAt && product.compareAt > product.price && <p className="text-xs text-mist line-through tabular">{formatNaira(product.compareAt)}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              cart.add(product.slug);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1400);
            }}
            className="btn btn-primary btn-sm !px-3.5"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
