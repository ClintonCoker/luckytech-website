"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { branches, branchById } from "@/content/store";
import { productTitle, type Product } from "@/content/products";
import { cart, useCart } from "@/lib/cart";
import { priceCart } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";
import { orderMessage, whatsappLink, type OrderContact } from "@/lib/whatsapp";
import { contactSchema } from "@/lib/schemas";
import { FLUTTERWAVE_SRC, PAYSTACK_SRC, loadScript, newReference } from "@/lib/payments.client";
import { IconWhatsApp } from "@/components/shared/Icons";

type Method = "paystack" | "flutterwave" | "whatsapp";
type Errors = Partial<Record<keyof OrderContact | "form", string>>;

export function CheckoutForm({ catalog, paystackKey, flutterwaveKey }: { catalog: Product[]; paystackKey: string; flutterwaveKey: string }) {
  const router = useRouter();
  const lines = useCart();
  const priced = priceCart(lines, catalog);
  const [branchId, setBranchId] = useState<"owo" | "akure">("owo");
  const [contact, setContact] = useState<OrderContact>({ name: "", phone: "", email: "", fulfilment: "pickup", address: "", note: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<Method | null>(null);
  const branch = branchById(branchId)!;
  const online = Boolean(paystackKey || flutterwaveKey);

  if (priced.lines.length === 0 && !busy) {
    return (
      <div className="card mt-10 p-10 text-center">
        <p className="font-display text-2xl font-semibold">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Shop phones</Link>
      </div>
    );
  }

  const set = <K extends keyof OrderContact>(k: K, v: OrderContact[K]) => setContact((c) => ({ ...c, [k]: v }));

  const validate = (method: Method): boolean => {
    const e: Errors = {};
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) for (const i of parsed.error.issues) e[i.path[0] as keyof OrderContact] ??= i.message;
    if (method !== "whatsapp" && !contact.email) e.email = "Enter your email to pay online (for your receipt)";
    if (contact.fulfilment === "delivery" && !contact.address?.trim()) e.address = "Enter a delivery address";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`co-${Object.keys(e)[0]}`)?.focus();
      return false;
    }
    return true;
  };

  const confirm = async (provider: "paystack" | "flutterwave", reference: string, transactionId?: string) => {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, reference, transactionId, branch: branchId, lines: priced.lines.map((l) => ({ slug: l.product.slug, qty: l.qty })), contact }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; whatsappUrl?: string; total?: number };
    if (!data.ok) {
      setErrors({ form: `${data.error ?? "We couldn't confirm your payment."} If you were charged, message ${branch.label} on WhatsApp with reference ${reference}.` });
      setBusy(null);
      return;
    }
    sessionStorage.setItem("lkt-last-order", JSON.stringify({ reference, total: data.total, whatsappUrl: data.whatsappUrl, branch: branch.label }));
    cart.clear();
    router.push(`/order/success?ref=${encodeURIComponent(reference)}`);
  };

  const payPaystack = async () => {
    setBusy("paystack");
    try {
      await loadScript(PAYSTACK_SRC);
      const reference = newReference("LKT");
      const pop = new window.PaystackPop!();
      pop.newTransaction({
        key: paystackKey,
        email: contact.email!,
        amount: priced.subtotal * 100,
        currency: "NGN",
        reference,
        metadata: { name: contact.name, phone: contact.phone, branch: branch.name, items: priced.lines.map((l) => `${l.qty} × ${productTitle(l.product)}`).join("; ") },
        onSuccess: (tx) => void confirm("paystack", tx.reference || reference),
        onCancel: () => setBusy(null),
        onError: (e) => {
          setErrors({ form: e?.message ?? "Paystack could not start. Try again or order on WhatsApp." });
          setBusy(null);
        },
      });
    } catch {
      setErrors({ form: "Paystack could not load. Check your connection, or order on WhatsApp." });
      setBusy(null);
    }
  };

  const payFlutterwave = async () => {
    setBusy("flutterwave");
    try {
      await loadScript(FLUTTERWAVE_SRC);
      const reference = newReference("LKT");
      let done = false;
      const modal = window.FlutterwaveCheckout!({
        public_key: flutterwaveKey,
        tx_ref: reference,
        amount: priced.subtotal,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: { email: contact.email, phone_number: contact.phone, name: contact.name },
        customizations: { title: "LuckyTech", description: `${priced.count} item(s) for pickup or delivery from ${branch.name}` },
        callback: (r) => {
          done = true;
          modal?.close();
          if (r.status === "successful" || r.status === "completed") void confirm("flutterwave", r.tx_ref, String(r.transaction_id));
          else {
            setErrors({ form: "Payment was not completed." });
            setBusy(null);
          }
        },
        onclose: () => {
          if (!done) setBusy(null);
        },
      });
    } catch {
      setErrors({ form: "Flutterwave could not load. Check your connection, or order on WhatsApp." });
      setBusy(null);
    }
  };

  const submit = (method: Method) => (e?: FormEvent) => {
    e?.preventDefault();
    if (!validate(method)) return;
    if (method === "paystack") void payPaystack();
    else if (method === "flutterwave") void payFlutterwave();
    else window.open(whatsappLink(branch, orderMessage(branch, priced.lines, priced.subtotal, contact)), "_blank", "noopener,noreferrer");
  };

  const fieldErr = (k: keyof OrderContact) => (errors[k] ? <small className="!text-signal-soft" id={`co-${k}-err`}>{errors[k]}</small> : null);

  return (
    <form onSubmit={submit(online ? (paystackKey ? "paystack" : "flutterwave") : "whatsapp")} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1fr_26rem]">
      <div className="space-y-8">
        <fieldset className="card space-y-5 p-6 sm:p-8">
          <legend className="sr-only">Your details</legend>
          <h2 className="font-display text-xl font-semibold">1. Your details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field">
              <span>Full name</span>
              <input id="co-name" className="input" autoComplete="name" value={contact.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby="co-name-err" />
              {fieldErr("name")}
            </label>
            <label className="field">
              <span>Phone / WhatsApp</span>
              <input id="co-phone" className="input" type="tel" autoComplete="tel" placeholder="0803 000 0000" value={contact.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby="co-phone-err" />
              {fieldErr("phone")}
            </label>
          </div>
          <label className="field">
            <span>Email {online ? "(for your payment receipt)" : "(optional)"}</span>
            <input id="co-email" className="input" type="email" autoComplete="email" value={contact.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby="co-email-err" />
            {fieldErr("email")}
          </label>
        </fieldset>

        <fieldset className="card space-y-5 p-6 sm:p-8">
          <legend className="sr-only">Store and delivery</legend>
          <h2 className="font-display text-xl font-semibold">2. Store and delivery</h2>
          <div>
            <p className="mb-2 text-sm font-semibold">Which store?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {branches.map((b) => (
                <label key={b.id} className="chip !justify-between !rounded-2xl !p-4">
                  <input type="radio" name="branch" value={b.id} checked={branchId === b.id} onChange={() => setBranchId(b.id)} />
                  <span>
                    <span className="block font-semibold text-white">{b.label}</span>
                    <span className="block text-xs">{b.address[0]}, {b.city}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Pickup or delivery?</p>
            <div className="flex flex-wrap gap-2">
              {(["pickup", "delivery"] as const).map((f) => (
                <label key={f} className="chip">
                  <input type="radio" name="fulfilment" value={f} checked={contact.fulfilment === f} onChange={() => set("fulfilment", f)} />
                  {f === "pickup" ? `Pick up at ${branch.city}` : "Deliver to me"}
                </label>
              ))}
            </div>
          </div>
          {contact.fulfilment === "delivery" && (
            <label className="field">
              <span>Delivery address</span>
              <textarea id="co-address" className="input min-h-24" autoComplete="street-address" value={contact.address} onChange={(e) => set("address", e.target.value)} aria-invalid={!!errors.address} aria-describedby="co-address-err" />
              <small>The delivery fee depends on your location. The store confirms it on WhatsApp before dispatch.</small>
              {fieldErr("address")}
            </label>
          )}
          <label className="field">
            <span>Note for the store (optional)</span>
            <input className="input" value={contact.note} onChange={(e) => set("note", e.target.value)} placeholder="Preferred colour, pickup time…" />
          </label>
        </fieldset>
      </div>

      <aside className="card h-fit p-6 sm:p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-xl font-semibold">3. Pay</h2>
        {priced.issues.length > 0 && (
          <p role="alert" className="mt-3 rounded-2xl bg-[#ffb020]/10 p-3 text-sm ring-1 ring-[#ffb020]/40">
            Some items changed since you added them: {priced.issues.map((i) => (i.kind === "reduced" ? `only ${i.available} ${i.name} left` : `${i.name} sold out`)).join(", ")}. Your total below is updated.
          </p>
        )}
        <ul className="mt-4 space-y-3 text-sm">
          {priced.lines.map((l) => (
            <li key={l.product.slug} className="flex justify-between gap-4">
              <span className="text-mist">{l.qty} × {productTitle(l.product)}</span>
              <span className="shrink-0 tabular">{formatNaira(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-semibold">
          <span>Total</span>
          <span className="tabular">{formatNaira(priced.subtotal)}</span>
        </div>

        {errors.form && <p role="alert" className="mt-4 rounded-2xl bg-signal/15 p-3 text-sm text-signal-soft ring-1 ring-signal/40">{errors.form}</p>}

        <div className="mt-6 space-y-3">
          {paystackKey && (
            <button type="button" onClick={() => submit("paystack")()} disabled={busy !== null} className="btn btn-primary w-full">
              {busy === "paystack" ? "Opening Paystack…" : `Pay ${formatNaira(priced.subtotal)} with Paystack`}
            </button>
          )}
          {flutterwaveKey && (
            <button type="button" onClick={() => submit("flutterwave")()} disabled={busy !== null} className="btn w-full bg-[#f5a623] text-[#2a1a00] hover:bg-[#ffb840]">
              {busy === "flutterwave" ? "Opening Flutterwave…" : "Pay with Flutterwave"}
            </button>
          )}
          <button type="button" onClick={() => submit("whatsapp")()} disabled={busy !== null} className="btn btn-wa w-full">
            <IconWhatsApp /> Order on WhatsApp ({branch.city})
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-mist">
          {online
            ? "Card, bank transfer and USSD are handled securely by Paystack or Flutterwave. We never see your card details."
            : "Online payment is coming soon. For now, send your order on WhatsApp and pay at the store or by transfer."}
        </p>
      </aside>
    </form>
  );
}
