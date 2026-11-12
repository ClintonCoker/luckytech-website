import Link from "next/link";
import { branches, store } from "@/content/store";
import { nav } from "@/content/nav";
import { Logo } from "@/components/layout/Logo";
import { formatPhone, telHref } from "@/lib/format";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-deep">
      <div className="aurora opacity-50" aria-hidden="true" />
      <div className="wrap relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">{store.tagline} Phones, gadgets, accessories and repairs in Owo and Akure.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-mist">
            {["Paystack", "Flutterwave", "Bank transfer", "WhatsApp"].map((p) => (
              <span key={p} className="rounded-full border border-line px-3 py-1">{p}</span>
            ))}
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/about", label: "About & FAQ" }, { href: "/cart", label: "Cart" }].map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        {branches.map((b) => (
          <div key={b.id}>
            <p className="text-sm font-semibold">{b.name}</p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-mist">
              {b.address.map((a) => <span key={a} className="block">{a}</span>)}
              <span className="block">{b.city}, {b.state}</span>
            </address>
            <ul className="mt-3 space-y-1 text-sm">
              {b.phones.map((p) => (
                <li key={p}><a href={telHref(p)} className="text-mist hover:text-white tabular">{formatPhone(p)}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap relative flex flex-col gap-2 border-t border-line py-6 text-xs text-mist sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {store.legalName}. All rights reserved.</p>
        <p>Prices in naira (₦) and subject to change. Availability confirmed on order.</p>
      </div>
    </footer>
  );
}
