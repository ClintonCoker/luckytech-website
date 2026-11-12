"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { branches } from "@/content/store";
import { whatsappLink } from "@/lib/whatsapp";
import { IconClose, IconWhatsApp } from "@/components/shared/Icons";

/** Floating WhatsApp button: customer picks the branch to chat with. */
export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="glass w-72 rounded-3xl p-4 shadow-2xl"
            role="dialog"
            aria-label="Chat on WhatsApp"
          >
            <p className="text-sm font-semibold">Chat with a store</p>
            <p className="mt-1 text-xs text-mist">Usually replies within minutes during opening hours.</p>
            <ul className="mt-3 space-y-2">
              {branches.map((b) => (
                <li key={b.id}>
                  <a
                    href={whatsappLink(b, `Hello LuckyTech ${b.city}, I have a question.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium ring-1 ring-white/10 transition hover:bg-[#25d366]/15 hover:ring-[#25d366]/60"
                  >
                    <span>{b.label}</span>
                    <IconWhatsApp className="text-[#25d366]" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp chat options" : "Chat on WhatsApp"}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-[#05210f] shadow-[0_12px_30px_-8px_rgb(37_211_102/0.8)] transition hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366]/40" aria-hidden="true" />}
        {open ? <IconClose /> : <IconWhatsApp className="h-7 w-7" />}
      </button>
    </div>
  );
}
