"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { categories, type Product } from "@/content/products";
import { deleteProductAction, saveProductAction } from "@/app/admin/actions";
import type { AdminProductInput } from "@/lib/admin";

/** Shrinks a photo to at most 1600px and WebP before upload. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/webp", 0.85));
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [v, setV] = useState<AdminProductInput>({
    slug: product?.slug,
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "smartphones",
    condition: product?.condition ?? "New",
    price: product?.price ?? ("" as unknown as number),
    compareAt: product?.compareAt ?? "",
    storage: product?.storage ?? "",
    ram: product?.ram ?? "",
    network: product?.network ?? "",
    trackStock: product ? product.stock != null : true,
    stock: product?.stock ?? 1,
    images: product?.images ?? [],
    description: product?.description ?? "",
    featured: product?.featured ?? false,
    active: product?.active !== false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState(0);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof AdminProductInput>(k: K, val: AdminProductInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const err = (k: string) => (errors[k] ? <small className="!text-signal-soft">{errors[k]}</small> : null);
  const images = v.images ?? [];

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setMsg(null);
    for (const f of Array.from(files).slice(0, 10 - images.length)) {
      setUploading((n) => n + 1);
      try {
        const body = new FormData();
        body.append("file", new File([await shrink(f)], `${f.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" }));
        body.append("folder", v.slug || v.name || "new");
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
        setV((s) => ({ ...s, images: [...(s.images ?? []), data.url!] }));
      } catch (e) {
        setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed" });
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const move = (i: number, by: number) => {
    const next = [...images];
    const j = i + by;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set("images", next);
  };

  const save = () =>
    start(async () => {
      setMsg(null);
      const r = await saveProductAction(v);
      if (!r.ok) {
        setErrors(r.fieldErrors ?? {});
        setMsg({ ok: false, text: r.error });
        return;
      }
      setErrors({});
      setMsg({ ok: true, text: r.message ?? "Saved." });
      if (!editing && r.slug) router.replace(`/admin/products/${r.slug}`);
      router.refresh();
    });

  const remove = () => {
    if (!product || !window.confirm(`Delete "${product.name}" permanently? This can't be undone. (To take it off the shop for now, untick "Show in shop" instead.)`)) return;
    start(async () => {
      const r = await deleteProductAction(product.slug);
      if (!r.ok) return setMsg({ ok: false, text: r.error });
      router.replace("/admin");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="grid gap-8 lg:grid-cols-[1fr_22rem]"
      noValidate
    >
      <div className="space-y-6">
        <fieldset className="card space-y-5 p-6">
          <legend className="sr-only">Details</legend>
          <label className="field">
            <span>Product name</span>
            <input className="input" value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. iPhone 13 Pro Max" aria-invalid={!!errors.name} />
            {err("name")}
          </label>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="field">
              <span>Brand</span>
              <input className="input" value={v.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Apple, Samsung, Oraimo…" list="brands" aria-invalid={!!errors.brand} />
              <datalist id="brands">{["Apple", "Samsung", "Redmi", "Infinix", "Tecno", "Itel", "Oraimo", "JBL", "Zealot"].map((b) => <option key={b} value={b} />)}</datalist>
              {err("brand")}
            </label>
            <label className="field">
              <span>Category</span>
              <select className="input" value={v.category} onChange={(e) => set("category", e.target.value as AdminProductInput["category"])}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Condition</span>
              <select className="input" value={v.condition} onChange={(e) => set("condition", e.target.value as AdminProductInput["condition"])}>
                <option value="New">New</option>
                <option value="UK-Used">UK-used</option>
              </select>
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <label className="field">
              <span>Storage</span>
              <input className="input" value={v.storage ?? ""} onChange={(e) => set("storage", e.target.value)} placeholder="128GB" />
            </label>
            <label className="field">
              <span>RAM</span>
              <input className="input" value={v.ram ?? ""} onChange={(e) => set("ram", e.target.value)} placeholder="8GB" />
            </label>
            <label className="field">
              <span>Network</span>
              <select className="input" value={v.network ?? ""} onChange={(e) => set("network", e.target.value as AdminProductInput["network"])}>
                <option value="">Not shown</option>
                <option value="4G">4G</option>
                <option value="5G">5G</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Description (optional)</span>
            <textarea className="input min-h-24" value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Battery health, colour, what's in the box…" />
          </label>
        </fieldset>

        <fieldset className="card p-6">
          <legend className="sr-only">Photos</legend>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Photos</p>
              <p className="text-sm text-mist">The first photo is the main one. Real photos of your own stock sell best.</p>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={images.length >= 10} className="btn btn-ghost btn-sm">+ Add photos</button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((src, i) => (
              <li key={src} className="group relative aspect-square overflow-hidden rounded-2xl bg-panel ring-1 ring-white/10">
                <Image src={src} alt={`Photo ${i + 1}`} fill sizes="160px" className="object-cover" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-night/80 px-2 py-0.5 text-[0.65rem] font-bold">MAIN</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-night/80 p-1.5 text-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 hover:bg-white/10 disabled:opacity-30" aria-label="Move left">←</button>
                  <button type="button" onClick={() => set("images", images.filter((x) => x !== src))} className="rounded px-2 py-1 text-signal-soft hover:bg-white/10">Remove</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="rounded px-2 py-1 hover:bg-white/10 disabled:opacity-30" aria-label="Move right">→</button>
                </div>
              </li>
            ))}
            {Array.from({ length: uploading }, (_, i) => (
              <li key={`up-${i}`} className="grid aspect-square place-items-center rounded-2xl bg-panel text-xs text-mist ring-1 ring-white/10">Uploading…</li>
            ))}
            {images.length === 0 && uploading === 0 && (
              <li className="col-span-full rounded-2xl border border-dashed border-line p-8 text-center text-sm text-mist">No photos yet.</li>
            )}
          </ul>
          {err("images")}
        </fieldset>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <fieldset className="card space-y-5 p-6">
          <legend className="sr-only">Price and stock</legend>
          <label className="field">
            <span>Price (₦)</span>
            <input className="input tabular" inputMode="numeric" value={String(v.price ?? "")} onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, "") as unknown as number)} aria-invalid={!!errors.price} />
            {err("price")}
          </label>
          <label className="field">
            <span>Old price (₦), optional</span>
            <input className="input tabular" inputMode="numeric" value={String(v.compareAt ?? "")} onChange={(e) => set("compareAt", e.target.value.replace(/[^\d]/g, "") as unknown as number)} />
            <small>Shown crossed out, with the % saving.</small>
            {err("compareAt")}
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={v.trackStock} onChange={(e) => set("trackStock", e.target.checked)} className="h-5 w-5 accent-[#19a84f]" />
            Count stock for this product
          </label>
          {v.trackStock && (
            <label className="field">
              <span>Units in stock</span>
              <input className="input tabular" inputMode="numeric" value={String(v.stock ?? "")} onChange={(e) => set("stock", e.target.value.replace(/[^\d]/g, "") as unknown as number)} aria-invalid={!!errors.stock} />
              <small>0 shows “Sold out”. 1 to 5 shows “Only N left”.</small>
              {err("stock")}
            </label>
          )}
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} className="h-5 w-5 accent-[#19a84f]" />
            Show in shop
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="h-5 w-5 accent-[#19a84f]" />
            Feature on the homepage
          </label>
        </fieldset>

        {msg && <p role={msg.ok ? "status" : "alert"} className={`rounded-2xl p-3 text-sm ring-1 ${msg.ok ? "bg-glow/10 text-glow ring-glow/30" : "bg-signal/15 text-signal-soft ring-signal/40"}`}>{msg.text}</p>}

        <button type="submit" disabled={pending || uploading > 0} className="btn btn-primary w-full">{pending ? "Saving…" : editing ? "Save changes" : "Add product"}</button>
        {editing && (
          <div className="flex justify-between gap-3 text-sm">
            <a href={`/product/${product!.slug}`} target="_blank" rel="noopener noreferrer" className="text-mist underline-offset-4 hover:text-white hover:underline">View in shop ↗</a>
            <button type="button" onClick={remove} disabled={pending} className="text-signal-soft underline-offset-4 hover:underline">Delete product</button>
          </div>
        )}
      </aside>
    </form>
  );
}
