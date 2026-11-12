"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { LOW_STOCK, stockState, type Product } from "@/content/products";
import { formatNaira } from "@/lib/format";
import { adjustStockAction, setActiveAction, setStockAction } from "@/app/admin/actions";

type Filter = "all" | "low" | "out" | "hidden";

export function Inventory({ products }: { products: Product[] }) {
  const [list, setList] = useState(products);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return list.filter((p) => {
      const s = stockState(p);
      if (filter === "low" && s !== "low") return false;
      if (filter === "out" && s !== "out") return false;
      if (filter === "hidden" && p.active !== false) return false;
      const hay = `${p.name} ${p.brand} ${p.storage ?? ""} ${p.ram ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [list, filter, q]);

  const patch = (slug: string, change: Partial<Product>) => setList((l) => l.map((p) => (p.slug === slug ? { ...p, ...change } : p)));

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, undo: () => void) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) {
        undo();
        setMsg(r.error ?? "Something went wrong.");
      } else setMsg(null);
    });

  const adjust = (p: Product, by: number) => {
    const before = p.stock;
    patch(p.slug, { stock: Math.max(0, (p.stock ?? 0) + by) });
    run(() => adjustStockAction(p.slug, by), () => patch(p.slug, { stock: before }));
  };
  const setExact = (p: Product, value: string) => {
    const n = value.trim() === "" ? null : Number(value);
    if (n != null && (!Number.isInteger(n) || n < 0)) return setMsg("Stock must be a whole number, 0 or more.");
    const before = p.stock;
    patch(p.slug, { stock: n ?? undefined });
    run(() => setStockAction(p.slug, n), () => patch(p.slug, { stock: before }));
  };
  const toggle = (p: Product) => {
    const before = p.active;
    patch(p.slug, { active: p.active === false });
    run(() => setActiveAction(p.slug, p.active === false), () => patch(p.slug, { active: before }));
  };

  const counts = {
    all: list.length,
    low: list.filter((p) => stockState(p) === "low").length,
    out: list.filter((p) => stockState(p) === "out").length,
    hidden: list.filter((p) => p.active === false).length,
  };

  return (
    <section className="mt-10" aria-labelledby="inv-title">
      <h2 id="inv-title" className="sr-only">All products</h2>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ["all", "All"],
            ["low", `${LOW_STOCK} or fewer left`],
            ["out", "Sold out"],
            ["hidden", "Hidden"],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className="chip">
              {label} <span className="tabular opacity-70">{counts[id]}</span>
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input !min-h-11 lg:max-w-xs" aria-label="Search products" />
      </div>

      {msg && <p role="alert" className="mt-4 rounded-2xl bg-signal/15 p-3 text-sm text-signal-soft ring-1 ring-signal/40">{msg}</p>}

      <div className="mt-4 overflow-x-auto rounded-3xl border border-line" aria-busy={pending}>
        <table className="w-full min-w-[46rem] text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.1em] text-mist">
            <tr>
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">In stock</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {shown.map((p) => {
              const s = stockState(p);
              return (
                <tr key={p.slug} className={p.active === false ? "opacity-55" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-panel">
                        {p.images?.[0] && <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-mist">{[p.brand, p.condition, p.storage, p.ram && `${p.ram} RAM`].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular">{formatNaira(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => adjust(p, -1)} disabled={!p.stock} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/15 hover:ring-glow disabled:opacity-30" aria-label={`One fewer ${p.name}`}>−</button>
                      <input
                        key={`${p.slug}-${p.stock}`}
                        defaultValue={p.stock ?? ""}
                        placeholder="∞"
                        inputMode="numeric"
                        aria-label={`Stock for ${p.name}`}
                        className="input !min-h-9 w-16 !px-2 text-center tabular"
                        onBlur={(e) => e.target.value !== String(p.stock ?? "") && setExact(p, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      />
                      <button type="button" onClick={() => adjust(p, 1)} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/15 hover:ring-glow" aria-label={`One more ${p.name}`}>+</button>
                      <button type="button" onClick={() => adjust(p, 5)} className="h-9 rounded-full px-2.5 text-xs font-semibold ring-1 ring-white/15 hover:ring-glow" aria-label={`Five more ${p.name}`}>+5</button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s === "out" ? (
                      <span className="rounded-full bg-signal/15 px-2.5 py-1 text-xs font-bold text-signal-soft">Sold out</span>
                    ) : s === "low" ? (
                      <span className="rounded-full bg-[#ffb020]/15 px-2.5 py-1 text-xs font-bold text-[#ffb020]">{p.stock} left</span>
                    ) : s === "untracked" ? (
                      <span className="text-xs text-mist">Not counted</span>
                    ) : (
                      <span className="rounded-full bg-glow/10 px-2.5 py-1 text-xs font-bold text-glow">In stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => toggle(p)} className="rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:ring-glow">
                        {p.active === false ? "Show in shop" : "Hide"}
                      </button>
                      <Link href={`/admin/products/${p.slug}`} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15">Edit</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-mist">Nothing here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mist">Leave the stock box empty (∞) for products you don&rsquo;t count. They always show as available.</p>
    </section>
  );
}
