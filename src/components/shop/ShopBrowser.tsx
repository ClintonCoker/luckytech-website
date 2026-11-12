"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { brandsOf, categories, type Category, type Condition, type Product } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { IconSearch } from "@/components/shared/Icons";
import { filterProducts, type SortKey } from "@/lib/shop";

export function ShopBrowser({ catalog, initialCategory, initialQuery }: { catalog: Product[]; initialCategory: Category | "all"; initialQuery: string }) {
  const [category, setCategory] = useState<Category | "all">(initialCategory);
  const [brand, setBrand] = useState<string>("all");
  const [condition, setCondition] = useState<Condition | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [query, setQuery] = useState(initialQuery);
  const [inStock, setInStock] = useState(false);
  const q = useDeferredValue(query);
  const brands = useMemo(() => brandsOf(catalog), [catalog]);
  const shownCategories = useMemo(() => categories.filter((c) => catalog.some((p) => p.category === c.id)), [catalog]);

  const list = useMemo(() => filterProducts(catalog, { category, brand, condition, sort, query: q, inStock }), [catalog, category, brand, condition, sort, q, inStock]);

  const updateUrl = (c: Category | "all") => {
    const url = new URL(window.location.href);
    if (c === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", c);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="mt-10">
      <div className="glass sticky top-[4.75rem] z-30 -mx-2 flex flex-col gap-3 rounded-3xl p-3 sm:mx-0 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search iPhone 14, Redmi, 256GB…" className="input !rounded-full !pl-11" />
        </label>
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {[{ id: "all" as const, label: "All" }, ...shownCategories].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => {
                setCategory(c.id);
                updateUrl(c.id);
              }}
              className="chip shrink-0"
            >
              {c.label}
            </button>
          ))}
          <button type="button" aria-pressed={inStock} onClick={() => setInStock((v) => !v)} className="chip shrink-0">In stock only</button>
        </div>
        <div className="grid grid-cols-3 gap-2 lg:w-[30rem]">
          <label>
            <span className="sr-only">Brand</span>
            <select className="input !min-h-11 !rounded-full !text-sm" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="all">All brands</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Condition</span>
            <select className="input !min-h-11 !rounded-full !text-sm" value={condition} onChange={(e) => setCondition(e.target.value as Condition | "all")}>
              <option value="all">New & used</option>
              <option value="New">New</option>
              <option value="UK-Used">UK-used</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select className="input !min-h-11 !rounded-full !text-sm" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="discount">Biggest discount</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-mist" aria-live="polite">{list.length} {list.length === 1 ? "product" : "products"}</p>

      {list.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-display text-2xl font-semibold">Nothing matches that yet.</p>
          <p className="mt-2 text-mist">We probably have it in store. Tell us what you’re looking for.</p>
          <Link href={`/request?details=${encodeURIComponent(query)}`} className="btn btn-primary mt-6">Request it</Link>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                <ProductCard product={p} priority={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
