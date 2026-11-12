"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { branches, branchById } from "@/content/store";
import { needOptions, requestSchema, type RequestInput } from "@/lib/schemas";
import { requestSummary } from "@/lib/request";
import { whatsappLink } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/shared/Icons";

type Errors = Partial<Record<keyof RequestInput | "form", string>>;

interface Props {
  initialNeed?: string;
  initialPayment?: string;
  initialModel?: string;
  initialDetails?: string;
}

export function RequestForm({ initialNeed = "", initialPayment = "", initialModel = "", initialDetails = "" }: Props) {
  const [v, setV] = useState<RequestInput>({
    name: "",
    phone: "",
    email: "",
    branch: "owo",
    needs: initialNeed ? [initialNeed as RequestInput["needs"][number]] : [],
    buyingFor: "personal",
    brandModel: initialModel,
    condition: "any",
    quantity: "1",
    budget: "",
    payment: initialPayment === "pay-later" ? "pay-later" : "not-sure",
    timeline: "this-week",
    details: initialDetails,
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [result, setResult] = useState<{ emailed: boolean; whatsappUrl: string } | null>(null);

  const set = <K extends keyof RequestInput>(k: K, val: RequestInput[K]) => setV((s) => ({ ...s, [k]: val }));
  const toggleNeed = (n: RequestInput["needs"][number]) => set("needs", v.needs.includes(n) ? v.needs.filter((x) => x !== n) : [...v.needs, n]);
  const err = (k: keyof RequestInput) => (errors[k] ? <small id={`rq-${k}-err`} className="!text-signal-soft">{errors[k]}</small> : null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = requestSchema.safeParse(v);
    if (!parsed.success) {
      const fe: Errors = {};
      for (const i of parsed.error.issues) fe[i.path[0] as keyof RequestInput] ??= i.message;
      setErrors(fe);
      document.getElementById(`rq-${Object.keys(fe)[0]}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    const branch = branchById(v.branch)!;
    const fallback = whatsappLink(branch, requestSummary(parsed.data));
    try {
      const res = await fetch("/api/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = (await res.json()) as { ok: boolean; emailed?: boolean; whatsappUrl?: string; error?: string; fieldErrors?: Errors };
      if (!data.ok) {
        setErrors({ ...(data.fieldErrors ?? {}), form: data.error ?? "Something went wrong." });
        setStatus("idle");
        return;
      }
      setResult({ emailed: Boolean(data.emailed), whatsappUrl: data.whatsappUrl ?? fallback });
    } catch {
      setResult({ emailed: false, whatsappUrl: fallback });
    }
    setStatus("sent");
  };

  if (status === "sent" && result) {
    const branch = branchById(v.branch)!;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 text-center sm:p-12" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-glow/15 text-3xl text-glow ring-1 ring-glow/40">✓</div>
        <h2 className="display mt-6 text-3xl sm:text-4xl">{result.emailed ? "Request sent." : "One last step."}</h2>
        <p className="mx-auto mt-4 max-w-md text-mist">
          {result.emailed
            ? `${branch.label} has your request and will get back to you. For a faster reply, send it on WhatsApp too.`
            : `Tap below to send your request to ${branch.label} on WhatsApp. It's already written for you.`}
        </p>
        <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-8">
          <IconWhatsApp /> Send on WhatsApp
        </a>
        <button type="button" onClick={() => { setStatus("idle"); setResult(null); }} className="mt-4 block w-full text-sm text-mist underline-offset-4 hover:text-white hover:underline">
          Make another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-8 p-6 sm:p-10" aria-describedby={errors.form ? "rq-form-err" : undefined}>
      <fieldset>
        <legend className="font-display text-xl font-semibold">What are you looking for?</legend>
        <p className="mt-1 text-sm text-mist">Pick everything that applies.</p>
        <div id="rq-needs" tabIndex={-1} className="mt-4 flex flex-wrap gap-2 outline-none">
          {needOptions.map((n) => (
            <label key={n} className="chip">
              <input type="checkbox" checked={v.needs.includes(n)} onChange={() => toggleNeed(n)} />
              {n}
            </label>
          ))}
        </div>
        {err("needs")}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span>Brand or model (if you know)</span>
          <input className="input" value={v.brandModel} onChange={(e) => set("brandModel", e.target.value)} placeholder="e.g. iPhone 13, 20,000mAh Oraimo" />
        </label>
        <label className="field">
          <span>Condition</span>
          <select className="input" value={v.condition} onChange={(e) => set("condition", e.target.value as RequestInput["condition"])}>
            <option value="any">Any</option>
            <option value="new">Brand new</option>
            <option value="uk-used">UK-used</option>
          </select>
        </label>
        <label className="field">
          <span>Quantity</span>
          <input className="input" inputMode="numeric" value={v.quantity} onChange={(e) => set("quantity", e.target.value)} />
        </label>
        <label className="field">
          <span>Budget (₦)</span>
          <input className="input" value={v.budget} onChange={(e) => set("budget", e.target.value)} placeholder="e.g. 200,000 to 300,000" />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Who is it for?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["personal", "Myself"],
            ["wholesale", "Wholesale (to resell)"],
            ["business", "A business or office"],
          ] as const).map(([val, label]) => (
            <label key={val} className="chip">
              <input type="radio" name="buyingFor" checked={v.buyingFor === val} onChange={() => set("buyingFor", val)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">How would you like to pay?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["full", "Pay in full"],
            ["pay-later", "Buy now, pay later (30% down)"],
            ["not-sure", "Not sure yet"],
          ] as const).map(([val, label]) => (
            <label key={val} className="chip">
              <input type="radio" name="payment" checked={v.payment === val} onChange={() => set("payment", val)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">When do you need it?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {([
            ["today", "Today"],
            ["this-week", "This week"],
            ["this-month", "This month"],
            ["just-asking", "Just asking for prices"],
          ] as const).map(([val, label]) => (
            <label key={val} className="chip">
              <input type="radio" name="timeline" checked={v.timeline === val} onChange={() => set("timeline", val)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>Tell us more</span>
        <textarea
          id="rq-details"
          className="input min-h-36"
          value={v.details}
          onChange={(e) => set("details", e.target.value)}
          placeholder="Colour, storage, the phone it's for (for cases and screen guards), what's wrong with your phone (for repairs)…"
          aria-invalid={!!errors.details}
          aria-describedby="rq-details-err"
        />
        {err("details")}
      </label>

      <div className="border-t border-line pt-8">
        <p className="font-display text-xl font-semibold">How do we reach you?</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="field">
            <span>Your name</span>
            <input id="rq-name" className="input" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby="rq-name-err" />
            {err("name")}
          </label>
          <label className="field">
            <span>Phone / WhatsApp</span>
            <input id="rq-phone" className="input" type="tel" autoComplete="tel" placeholder="0803 000 0000" value={v.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby="rq-phone-err" />
            {err("phone")}
          </label>
          <label className="field">
            <span>Email (optional)</span>
            <input id="rq-email" className="input" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby="rq-email-err" />
            {err("email")}
          </label>
          <label className="field">
            <span>Nearest store</span>
            <select className="input" value={v.branch} onChange={(e) => set("branch", e.target.value as RequestInput["branch"])}>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </label>
        </div>
        {/* Spam trap, hidden from people */}
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Website
          <input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <AnimatePresence>
        {errors.form && (
          <motion.p id="rq-form-err" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl bg-signal/15 p-3 text-sm text-signal-soft ring-1 ring-signal/40">
            {errors.form}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
