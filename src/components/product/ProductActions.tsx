"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { branches } from "@/content/store";
import { cart } from "@/lib/cart";
import { productEnquiry, whatsappLink } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/shared/Icons";

export function ProductActions({ slug, title, price }: { slug: string; title: string; price: string }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full ring-1 ring-white/15">
          <button type="button" className="grid h-12 w-12 place-items-center text-xl" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One fewer">−</button>
          <span className="w-8 text-center font-semibold tabular" aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</span>
          <button type="button" className="grid h-12 w-12 place-items-center text-xl" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="One more">+</button>
        </div>
        <button
          type="button"
          className="btn btn-ghost flex-1"
          onClick={() => {
            cart.add(slug, qty);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1600);
          }}
        >
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          className="btn btn-primary flex-1"
          onClick={() => {
            cart.add(slug, qty);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>

      <div className="rounded-3xl border border-line p-5">
        <p className="text-sm font-semibold">Ask or order on WhatsApp</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {branches.map((b) => (
            <a key={b.id} href={whatsappLink(b, productEnquiry(b, title, price))} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
              <IconWhatsApp /> {b.label}
            </a>
          ))}
        </div>
        <Link href={`/request?need=Phone&payment=pay-later&model=${encodeURIComponent(title)}`} className="mt-3 inline-block text-sm text-glow underline-offset-4 hover:underline">
          Apply for buy now, pay later →
        </Link>
      </div>
    </div>
  );
}
