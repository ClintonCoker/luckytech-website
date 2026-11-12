import "server-only";
import { serverSecrets } from "@/lib/env";

export interface VerifyResult {
  ok: boolean;
  reason?: string;
  amount?: number;
  reference?: string;
}

/** Confirms a Paystack payment with Paystack's servers. `expected` is in naira. */
export async function verifyPaystack(reference: string, expected: number): Promise<VerifyResult> {
  const key = serverSecrets().paystack;
  if (!key) return { ok: false, reason: "Paystack is not set up on the server." };
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as { status?: boolean; data?: { status?: string; amount?: number; currency?: string; reference?: string } } | null;
  const d = body?.data;
  if (!res.ok || !body?.status || !d) return { ok: false, reason: "Could not reach Paystack to confirm the payment." };
  if (d.status !== "success") return { ok: false, reason: `Payment status is "${d.status}".` };
  if (d.currency !== "NGN") return { ok: false, reason: "Payment was not in naira." };
  if (d.amount !== Math.round(expected * 100)) return { ok: false, reason: "Amount paid does not match the order total." };
  return { ok: true, amount: d.amount / 100, reference: d.reference };
}

/** Confirms a Flutterwave payment. `expected` is in naira. */
export async function verifyFlutterwave(transactionId: string, txRef: string, expected: number): Promise<VerifyResult> {
  const key = serverSecrets().flutterwave;
  if (!key) return { ok: false, reason: "Flutterwave is not set up on the server." };
  if (!/^\d+$/.test(transactionId)) return { ok: false, reason: "Invalid transaction id." };
  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as { status?: string; data?: { status?: string; amount?: number; currency?: string; tx_ref?: string } } | null;
  const d = body?.data;
  if (!res.ok || body?.status !== "success" || !d) return { ok: false, reason: "Could not reach Flutterwave to confirm the payment." };
  if (d.status !== "successful") return { ok: false, reason: `Payment status is "${d.status}".` };
  if (d.tx_ref !== txRef) return { ok: false, reason: "Payment reference does not match." };
  if (d.currency !== "NGN") return { ok: false, reason: "Payment was not in naira." };
  if (Number(d.amount) < expected) return { ok: false, reason: "Amount paid does not match the order total." };
  return { ok: true, amount: Number(d.amount), reference: txRef };
}
