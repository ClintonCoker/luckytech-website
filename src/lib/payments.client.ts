"use client";

/** Loads a payment provider's checkout script once. */
const loading = new Map<string, Promise<void>>();
export function loadScript(src: string): Promise<void> {
  if (!loading.has(src)) {
    loading.set(
      src,
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => {
          loading.delete(src);
          reject(new Error(`Could not load ${src}`));
        };
        document.head.appendChild(s);
      }),
    );
  }
  return loading.get(src)!;
}

export const PAYSTACK_SRC = "https://js.paystack.co/v2/inline.js";
export const FLUTTERWAVE_SRC = "https://checkout.flutterwave.com/v3.js";

interface PaystackTx {
  reference: string;
}
interface PaystackPopInstance {
  newTransaction(opts: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
    onSuccess: (tx: PaystackTx) => void;
    onCancel: () => void;
    onError?: (e: { message?: string }) => void;
  }): void;
}
interface FlutterwaveResponse {
  status: string;
  transaction_id: number | string;
  tx_ref: string;
}
interface FlutterwaveModal {
  close(): void;
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance;
    FlutterwaveCheckout?: (opts: Record<string, unknown> & { callback: (r: FlutterwaveResponse) => void; onclose: () => void }) => FlutterwaveModal;
  }
}

export function newReference(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}
