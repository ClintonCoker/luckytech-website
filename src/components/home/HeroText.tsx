"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IconArrow } from "@/components/shared/Icons";

const words = ["The", "phone", "you", "want.", "The", "peace", "of", "mind", "you", "deserve."];

export function HeroText({ productCount }: { productCount: number }) {
  const reduced = useReducedMotion();
  const up = (i: number) => (reduced ? {} : { initial: { opacity: 0, y: "0.6em", filter: "blur(8px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const } });
  return (
    <div className="max-w-2xl">
      <motion.p {...up(0)} className="eyebrow">LuckyTech Communications · Owo & Akure</motion.p>
      <h1 id="hero-title" className="display mt-6 text-[clamp(2.9rem,7.6vw,6.4rem)]">
        {words.map((w, i) => (
          <motion.span key={i} {...up(i + 1)} className={`mr-[0.22em] inline-block ${i >= 4 ? "text-gradient" : ""}`}>
            {w}
          </motion.span>
        ))}
      </h1>
      <motion.p {...up(12)} className="mt-6 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">
        New and UK-used iPhones and Android phones, original screens, chargers, power banks and more. Fixed in under 45 minutes. Take it home with 30% down.
      </motion.p>
      <motion.div {...up(14)} className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="btn btn-primary">Shop phones <IconArrow /></Link>
        <Link href="/request" className="btn btn-ghost">Tell us what you need</Link>
      </motion.div>
      <motion.dl {...up(16)} className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
        {[[`${Math.floor(productCount / 10) * 10}+`, "Products online"], ["45 min", "Repairs"], ["2", "Stores"]].map(([v, l]) => (
          <div key={l}>
            <dt className="sr-only">{l}</dt>
            <dd className="font-display text-2xl font-bold sm:text-3xl">{v}</dd>
            <dd className="mt-1 text-xs text-mist sm:text-sm">{l}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}
