"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY, type CartLine } from "@/lib/pricing";

const KEY = "lkt-cart-v1";
const EVENT = "lkt:cart";
const EMPTY: CartLine[] = [];
let cache: CartLine[] | null = null;

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(raw) ? raw.filter((l) => typeof l?.slug === "string" && Number(l?.qty) > 0) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode: keep the cart in memory */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const cart = {
  add(slug: string, qty = 1) {
    const lines = read();
    const found = lines.find((l) => l.slug === slug);
    write(found ? lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)) : [...lines, { slug, qty }]);
    window.dispatchEvent(new CustomEvent("lkt:added", { detail: slug }));
  },
  setQty(slug: string, qty: number) {
    write(qty < 1 ? read().filter((l) => l.slug !== slug) : read().map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },
  remove(slug: string) {
    write(read().filter((l) => l.slug !== slug));
  },
  clear() {
    write([]);
  },
};
