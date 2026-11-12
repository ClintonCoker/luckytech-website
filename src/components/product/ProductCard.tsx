"use client";

import Link from "next/link";
import { useState } from "react";
import { discountPercent, stockState, type Product } from "@/content/products";
import { ProductMedia } from "@/components/product/ProductMedia";
import { StockBadge } from "@/components/product/StockBadge";
import { formatNaira } from "@/lib/format";
import { cart } from "@/lib/cart";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = discountPercent(product);
  const soldOut = stockState(product) === "out";
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
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-panel" aria-label={product.name}>
        <div className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${soldOut ? "opacity-45 grayscale" : ""}`}>
          <ProductMedia product={product} priority={priority} />
        </div>
        {(product.images?.length ?? 0) > 1 && !soldOut && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <ProductMedia product={product} index={1} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel/80 to-transparent" />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          <span className="tag-cond !bg-night/70 backdrop-blur" data-used={product.condition === "UK-Used"}>{product.condition}</span>
          {off > 0 && !soldOut && <span className="tag-sale">-{off}%</span>}
        </div>
        <StockBadge product={product} className="absolute bottom-3 left-3 z-10" />
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
            disabled={soldOut}
            onClick={() => {
              cart.add(product.slug);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1400);
            }}
            className="btn btn-primary btn-sm !px-3.5"
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            {soldOut ? "Sold out" : added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
