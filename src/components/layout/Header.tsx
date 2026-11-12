"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/content/nav";
import { Logo } from "@/components/layout/Logo";
import { IconCart, IconClose, IconMenu } from "@/components/shared/Icons";
import { useCart } from "@/lib/cart";

export function Header() {
  const pathname = usePathname();
  const lines = useCart();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onAdd = () => {
      setBump(true);
      window.setTimeout(() => setBump(false), 600);
    };
    window.addEventListener("lkt:added", onAdd);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("lkt:added", onAdd);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "bg-night/80 shadow-[0_1px_0_rgb(13_31_21/0.08)] backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active ? "page" : undefined} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-cloud" : "text-mist hover:text-cloud"}`}>
                    {active && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-cloud/8 ring-1 ring-cloud/10" />}
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" className={`relative grid h-11 w-11 place-items-center rounded-full ring-1 ring-cloud/15 transition hover:ring-glow ${bump ? "scale-110" : ""}`} aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            <IconCart />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1 text-[0.7rem] font-bold tabular">{count}</span>}
          </Link>
          <Link href="/shop" className="btn btn-primary btn-sm hidden sm:inline-flex">Shop now</Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-cloud/15 lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t border-line bg-night lg:hidden"
          >
            <ul className="wrap flex flex-col gap-1 py-6">
              {[{ href: "/", label: "Home" }, ...nav, { href: "/cart", label: `Cart (${count})` }].map((n, i) => (
                <motion.li key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-3 font-display text-2xl font-semibold hover:bg-cloud/5">
                    {n.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
