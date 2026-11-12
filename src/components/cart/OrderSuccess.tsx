"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatNaira } from "@/lib/format";
import { IconWhatsApp } from "@/components/shared/Icons";

interface LastOrder {
  reference: string;
  total?: number;
  whatsappUrl?: string;
  branch?: string;
}

const read = (): string => sessionStorage.getItem("lkt-last-order") ?? "";
const noop = () => () => {};

export function OrderSuccess() {
  const raw = useSyncExternalStore(noop, read, () => "");
  let order: LastOrder | null = null;
  try {
    order = raw ? (JSON.parse(raw) as LastOrder) : null;
  } catch {
    order = null;
  }

  return (
    <div className="card relative mx-auto max-w-2xl overflow-hidden p-8 text-center sm:p-14">
      <div className="aurora opacity-70" aria-hidden="true" />
      <div className="relative">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-glow/15 text-4xl text-glow ring-1 ring-glow/40">✓</div>
        <h1 className="display mt-6 text-[clamp(2.2rem,5vw,3.5rem)]">Payment received.</h1>
        <p className="mt-4 text-lg text-mist">Thank you! Your order is confirmed{order?.branch ? ` with ${order.branch}` : ""}.</p>
        {order && (
          <dl className="mx-auto mt-8 grid max-w-sm gap-2 rounded-2xl border border-line p-5 text-left text-sm">
            <div className="flex justify-between gap-4"><dt className="text-mist">Reference</dt><dd className="font-mono">{order.reference}</dd></div>
            {order.total != null && <div className="flex justify-between gap-4"><dt className="text-mist">Paid</dt><dd className="tabular">{formatNaira(order.total)}</dd></div>}
          </dl>
        )}
        <p className="mt-6 text-mist">Send your order to the store on WhatsApp so they can get it ready and confirm pickup or delivery.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {order?.whatsappUrl && (
            <a href={order.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><IconWhatsApp /> Send order on WhatsApp</a>
          )}
          <Link href="/shop" className="btn btn-ghost">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}
