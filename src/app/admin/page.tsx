import Link from "next/link";
import { requireAdmin } from "@/lib/auth.server";
import { dbConfigured, db, rowToProduct, type ProductRow } from "@/lib/db.server";
import { LOW_STOCK, stockState } from "@/content/products";
import { formatNaira } from "@/lib/format";
import { AdminShell } from "@/components/admin/AdminShell";
import { Inventory } from "@/components/admin/Inventory";
import { SetupHelpers } from "@/components/admin/SetupHelpers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stock" };

interface OrderRow {
  reference: string;
  provider: string;
  total: number;
  branch: string;
  items: { name: string; qty: number }[];
  contact: { name?: string; phone?: string };
  created_at: string;
}

export default async function AdminHome() {
  await requireAdmin();

  if (!dbConfigured()) {
    return (
      <AdminShell>
        <div className="card mx-auto max-w-2xl p-8">
          <h1 className="font-display text-2xl font-semibold">Connect the database</h1>
          <p className="mt-2 text-mist">The admin needs a free Supabase database to save stock and products. It takes about 10 minutes, once.</p>
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-mist">
            <li>Create a project at supabase.com.</li>
            <li>Open <b className="text-cloud">SQL Editor</b>, paste the contents of <code className="font-mono">supabase/schema.sql</code> and click <b className="text-cloud">Run</b>.</li>
            <li>From <b className="text-cloud">Project Settings → API</b>, copy the Project URL and the <b className="text-cloud">service_role</b> key into <code className="font-mono">SUPABASE_URL</code> and <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>.</li>
            <li>Restart the site (or redeploy on Vercel) and come back here.</li>
          </ol>
          <p className="mt-6 text-sm text-mist">Full steps are in the README.</p>
        </div>
      </AdminShell>
    );
  }

  const client = db();
  const [{ data: rows, error }, { data: orders }] = await Promise.all([
    client.from("products").select("*").order("sort_order").order("created_at", { ascending: false }),
    client.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
  ]);
  if (error) {
    return (
      <AdminShell>
        <p role="alert" className="card p-6 text-signal-soft">Couldn&rsquo;t load products: {error.message}. Did you run <code>supabase/schema.sql</code>?</p>
      </AdminShell>
    );
  }
  const products = ((rows ?? []) as ProductRow[]).map(rowToProduct);
  const live = products.filter((p) => p.active !== false);
  const out = live.filter((p) => stockState(p) === "out");
  const low = live.filter((p) => stockState(p) === "low");
  const units = live.reduce((s, p) => s + (p.stock ?? 0), 0);
  const value = live.reduce((s, p) => s + (p.stock ?? 0) * p.price, 0);

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Stock</h1>
          <p className="mt-1 text-mist">Change numbers with the buttons. The shop updates straight away.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">+ Add product</Link>
      </div>

      <SetupHelpers empty={products.length === 0} />

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Products in shop", String(live.length), ""],
          ["Sold out", String(out.length), out.length ? "text-signal-soft" : ""],
          [`${LOW_STOCK} or fewer left`, String(low.length), low.length ? "text-[#a85f00]" : ""],
          ["Units in stock", String(units), ""],
          ["Stock value", formatNaira(value), ""],
        ].map(([label, v, tone]) => (
          <div key={label} className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-mist">{label}</dt>
            <dd className={`mt-2 font-display text-2xl font-bold tabular ${tone}`}>{v}</dd>
          </div>
        ))}
      </dl>

      {(out.length > 0 || low.length > 0) && (
        <section aria-labelledby="alerts" className="mt-8 grid gap-3 lg:grid-cols-2">
          <h2 id="alerts" className="sr-only">Needs restocking</h2>
          {out.length > 0 && (
            <div className="rounded-3xl bg-signal/10 p-5 ring-1 ring-signal/40">
              <p className="font-semibold text-signal-soft">Sold out ({out.length})</p>
              <p className="mt-1 text-sm text-mist">{out.map((p) => `${p.name}${p.storage ? ` ${p.storage}` : ""}`).join(" · ")}</p>
            </div>
          )}
          {low.length > 0 && (
            <div className="rounded-3xl bg-[#ffb020]/10 p-5 ring-1 ring-[#ffb020]/40">
              <p className="font-semibold text-[#a85f00]">{LOW_STOCK} or fewer left ({low.length})</p>
              <p className="mt-1 text-sm text-mist">{low.map((p) => `${p.name}${p.storage ? ` ${p.storage}` : ""} (${p.stock})`).join(" · ")}</p>
            </div>
          )}
        </section>
      )}

      {/* key: start fresh whenever the saved data changes (after import, refresh, etc.) */}
      <Inventory key={products.map((p) => `${p.slug}:${p.stock ?? "x"}:${p.active}`).join("|")} products={products} />

      <section className="mt-12" aria-labelledby="orders-title">
        <h2 id="orders-title" className="font-display text-xl font-semibold">Recent online payments</h2>
        <p className="mt-1 text-sm text-mist">Paid with Paystack or Flutterwave. These were taken out of stock automatically. WhatsApp orders are not listed: adjust their stock by hand.</p>
        {(orders as OrderRow[] | null)?.length ? (
          <ul className="mt-4 divide-y divide-line rounded-3xl border border-line">
            {(orders as OrderRow[]).map((o) => (
              <li key={o.reference} className="flex flex-col gap-1 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-semibold">{o.contact?.name ?? "Customer"}</span> <span className="text-mist">{o.contact?.phone}</span>
                  <span className="block text-mist">{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold tabular">{formatNaira(o.total)}</span>
                  <span className="block text-xs text-mist">{o.branch} · {o.provider} · {new Date(o.created_at).toLocaleString("en-NG")}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-mist">No online payments yet.</p>
        )}
      </section>
    </AdminShell>
  );
}
