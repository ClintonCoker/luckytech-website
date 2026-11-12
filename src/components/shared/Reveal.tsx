"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Fades and lifts content into view once. */
export function Reveal({ children, delay = 0, className = "", y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
